/**
 * Lead AI — generates personalized cold-outreach emails (subject + body)
 * using Google Gemini 2.0 Flash. Free tier: 15 RPM, 1500 RPD — generous
 * for our scale (~30 emails/day).
 *
 * Falls back to a static template when GEMINI_API_KEY is missing so the
 * sender can still operate (just without per-lead personalization).
 */
import {env} from '../config/env';
import {logger} from '../utils';

interface LeadInput {
    companyName: string;
    country: string;
    city: string;
    ownerName?: string | null;
    website?: string | null;
    websiteContent?: string | null;
    language: string;
}

interface GeneratedEmail {
    subject: string;
    body: string;
    usedAi: boolean;     // true if Gemini wrote it, false if fallback template
    failureReason?: string; // populated when usedAi=false but isConfigured() was true (rate limit, network, etc.)
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Cold-outreach template is fixed by the founder. Gemini's only freedom is to
 * rewrite the SECOND sentence of paragraph one with a one-line personalization
 * based on what the website actually shows. Everything else is verbatim.
 */
function buildSystemPrompt(senderName: string, companyName: string, demoUrl: string): string {
    return `You are an SDR. Output a cold B2B email in Russian to a car-rental business owner.
The template below is FINAL. You may rewrite ONLY the [PERSONALIZED_OBSERVATION] line — one short Russian sentence based on the website excerpt (their fleet, locations, feature, anything specific). Don't fabricate. If the excerpt is too thin, fall back to: "Заметил ваш автопрокат".

EVERYTHING ELSE STAYS WORD-FOR-WORD. No extra greetings, no closing fluff, no rewording.

TEMPLATE:

Subject: Идея для роста бронирований ${companyName}

Здравствуйте.

[PERSONALIZED_OBSERVATION] Мы помогаем прокатным компаниям получать больше прямых корпоративных и частных клиентов за счёт современного интерфейса и быстрой работы сайта.

Вместо долгой разработки с нуля за $8–15K мы разворачиваем готовое решение по подписке за $149/мес. Кейс: запустили проект в Тбилиси за 4 дня — https://merent.ge/. Посмотреть, как это работает вживую, можно также на нашем проекте: ${demoUrl}.

Напишите нам здесь или в Telegram (@Reiz_Rental), и мы отправим короткую PDF-презентацию с деталями.

— ${senderName}

RULES:
- Subject must be EXACTLY: "Идея для роста бронирований ${companyName}"
- The personalized observation must be ONE short Russian sentence ending with a period. Examples: "Увидел ваш парк Hyundai в Анталии — отличная подборка для туристов." / "Заметил, что у вас доставка по всему городу." / "Понравился ваш сервис по аэропорту."
- All URLs (https://merent.ge/, ${demoUrl}, @Reiz_Rental) must remain verbatim.
- Use "вы" (formal). Russian throughout.
- Do NOT change the signature line.

Output STRICT JSON only: {"subject": "...", "body": "..."}.
Do NOT wrap in markdown. Do NOT add commentary outside the JSON.`;
}

function demoUrlForLanguage(language: string): string {
    return language === 'en' ? 'https://reiz.com.ua/en' : 'https://reiz.com.ua/ru';
}

/**
 * Soft-opt-out footer required for cold outreach to stay on the right side of
 * GDPR / CAN-SPAM. Plain language, no internal IDs leaked.
 */
function withFooter(body: string, language: string): string {
    const isRu = language === 'ru' || language === undefined;
    const footer = isRu
        ? `\n\nP.S. Если эта тема неактуальна — просто ответьте «стоп», и я больше не напишу.`
        : `\n\nP.S. Not relevant? Just reply "stop" and we won't reach out again.`;
    return body + footer;
}

class LeadAIService {
    private readonly apiKey = env.GEMINI_API_KEY || '';

    // Circuit breaker — if Gemini returns 429 (quota exhausted), back off for an
    // hour so we stop hammering the API and stop polluting logs. A successful
    // call resets the breaker. Picks itself back up automatically when the key
    // gets fixed (e.g. after rotation to a key from a non-billing project).
    private cooldownUntil: number = 0;
    private cooldownReason: string = '';

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    private isInCooldown(): boolean {
        return Date.now() < this.cooldownUntil;
    }

    /**
     * Generate the initial cold email for a lead.
     */
    async generateInitial(lead: LeadInput): Promise<GeneratedEmail> {
        const lang = lead.language || 'ru';
        const wrap = (subj: string, body: string, usedAi: boolean, failureReason?: string): GeneratedEmail => ({
            subject: subj,
            body: withFooter(body, lang),
            usedAi,
            ...(failureReason ? {failureReason} : {}),
        });

        if (!this.isConfigured()) {
            const t = this.fallbackTemplate(lead);
            return wrap(t.subject, t.body, false);
        }
        if (this.isInCooldown()) {
            const t = this.fallbackTemplate(lead);
            return wrap(t.subject, t.body, false, `Gemini in cooldown until ${new Date(this.cooldownUntil).toISOString()}: ${this.cooldownReason}`);
        }
        try {
            const ai = await this.callGemini(lead);
            this.cooldownUntil = 0;
            this.cooldownReason = '';
            return wrap(ai.subject, ai.body, true);
        } catch (err: any) {
            const reason = err?.message ?? String(err);
            if (reason.includes('HTTP 429')) {
                this.cooldownUntil = Date.now() + 60 * 60 * 1000;
                this.cooldownReason = '429 quota exhausted';
                logger.warn(`[lead-ai] Gemini 429 — entering 1h cooldown. Will use fallback template until ${new Date(this.cooldownUntil).toISOString()}`);
            } else {
                logger.error(`[lead-ai] Gemini call failed for ${lead.companyName}: ${reason}`);
            }
            const t = this.fallbackTemplate(lead);
            return wrap(t.subject, t.body, false, reason.slice(0, 200));
        }
    }

    /**
     * Follow-ups don't need full personalization — they reference the
     * previous thread, so a deterministic localized template is fine
     * (and preserves Gemini quota for the high-leverage initial emails).
     */
    buildFollowUp(lead: LeadInput, kind: 'fu_3d' | 'fu_7d' | 'breakup_14d'): GeneratedEmail {
        const isRu = lead.language === 'ru' || ['KZ', 'AM', 'ME', 'RS', 'TR'].includes(lead.country);
        const senderName = env.OUTREACH_SENDER_NAME;
        const demoUrl = demoUrlForLanguage(isRu ? 'ru' : 'en');
        const lang = isRu ? 'ru' : 'en';
        const wrap = (subj: string, body: string): GeneratedEmail => ({
            subject: subj,
            body: withFooter(body, lang),
            usedAi: false,
        });

        if (kind === 'fu_3d') {
            return isRu
                ? wrap(
                    'Re: REIZ',
                    `Поднимаю тред на случай, если пропустили.\n\nЖивой кейс — merent.ge: тот же движок, полностью в их брендинге, запустили за 4 дня. Наш флагман: ${demoUrl}. Если интересно — 2-мин видео покажу.\n\n— ${senderName}`,
                )
                : wrap(
                    'Re: REIZ',
                    `Bumping in case you missed this.\n\nLive case — merent.ge: same engine, fully their branding, launched in 4 days. Flagship: ${demoUrl}. Want a 2-min walkthrough?\n\n— ${senderName}`,
                );
        }

        if (kind === 'fu_7d') {
            return isRu
                ? wrap(
                    'Последний пинг по сайту',
                    `Понимаю, что не на первом месте.\n\nНо если сайт сейчас на Tilda/WordPress — это -30% мобильной конверсии для туристов. У нас Next.js, $149/мес, без подрядчиков. Стоит 10 минут на демо или нет?\n\n— ${senderName}`,
                )
                : wrap(
                    'Last ping about your site',
                    `I get it's not top-of-mind right now.\n\nBut if you're on Tilda/WordPress — that's -30% mobile conversion on tourist traffic. We're on Next.js, $149/mo, no contractors. Worth a 10-min look?\n\n— ${senderName}`,
                );
        }

        // breakup
        return isRu
            ? wrap(
                'Закрываю тред',
                `Если не приоритет — без проблем, не буду беспокоить.\n\nЕсли в будущем понадобится — пишите: @Reiz_Rental в Telegram.\n\n— ${senderName}`,
            )
            : wrap(
                'Closing the loop',
                `If it's not a priority right now — totally fine, won't bother you again.\n\nIf this comes up later: @Reiz_Rental on Telegram.\n\n— ${senderName}`,
            );
    }

    private async callGemini(lead: LeadInput): Promise<{subject: string; body: string}> {
        const language = lead.language || 'ru';
        const userPrompt = `Recipient:
- Company: ${lead.companyName}
- Country/City: ${lead.country} / ${lead.city}
- Owner name (best guess): ${lead.ownerName ?? 'unknown'}
- Website: ${lead.website ?? '(none)'}
- Website excerpt:
"""
${(lead.websiteContent ?? '').slice(0, 1500)}
"""

Write the email in language: ${language} (use Cyrillic if Russian/Serbian/Kazakh).`;

        const senderName = env.OUTREACH_SENDER_NAME;
        const demoUrl = demoUrlForLanguage(language);
        const body = {
            systemInstruction: {parts: [{text: buildSystemPrompt(senderName, lead.companyName, demoUrl)}]},
            contents: [{role: 'user', parts: [{text: userPrompt}]}],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 800,
                responseMimeType: 'application/json',
            },
        };

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 30_000);
        try {
            const res = await fetch(`${GEMINI_URL}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body),
                signal: ctrl.signal,
            });
            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 200)}`);
            }
            const data = await res.json() as {
                candidates?: {content: {parts: {text: string}[]}}[];
            };
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
            const json = JSON.parse(text);
            if (typeof json.subject !== 'string' || typeof json.body !== 'string') {
                throw new Error('Gemini returned malformed JSON');
            }
            return {subject: json.subject.slice(0, 200), body: json.body.slice(0, 4000)};
        } finally {
            clearTimeout(timer);
        }
    }

    /**
     * Founder-approved fallback. Used when Gemini is missing/rate-limited/network-fails.
     * Same shape as the AI template, but with a generic observation line —
     * no website-specific personalization.
     */
    private fallbackTemplate(lead: LeadInput): {subject: string; body: string} {
        const senderName = env.OUTREACH_SENDER_NAME;
        const isRu = lead.language === 'ru' || ['KZ', 'AM', 'ME', 'RS', 'TR'].includes(lead.country);
        const demoUrl = demoUrlForLanguage(isRu ? 'ru' : 'en');

        if (isRu) {
            return {
                subject: `Идея для роста бронирований ${lead.companyName}`,
                body:
                    `Здравствуйте.\n\n` +
                    `Заметил ваш автопрокат. Мы помогаем прокатным компаниям получать больше прямых корпоративных и частных клиентов за счёт современного интерфейса и быстрой работы сайта.\n\n` +
                    `Вместо долгой разработки с нуля за $8–15K мы разворачиваем готовое решение по подписке за $149/мес. Кейс: запустили проект в Тбилиси за 4 дня — https://merent.ge/. Посмотреть, как это работает вживую, можно также на нашем проекте: ${demoUrl}.\n\n` +
                    `Напишите нам здесь или в Telegram (@Reiz_Rental), и мы отправим короткую PDF-презентацию с деталями.\n\n` +
                    `— ${senderName}`,
            };
        }

        return {
            subject: `Idea to grow ${lead.companyName} bookings`,
            body:
                `Hi.\n\n` +
                `Noticed your car-rental business. We help rental companies get more direct corporate and private bookings with a modern UI and a fast site.\n\n` +
                `Instead of a $8–15K custom build, we ship a turn-key solution for $149/month. Case study: we launched a project in Tbilisi in 4 days — https://merent.ge/. You can also see it live on our flagship: ${demoUrl}.\n\n` +
                `Reply here or ping us on Telegram (@Reiz_Rental) and we'll send a short PDF deck with the details.\n\n` +
                `— ${senderName}`,
        };
    }
}

export default new LeadAIService();
