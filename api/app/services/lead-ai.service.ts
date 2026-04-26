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

function buildSystemPrompt(senderName: string, demoUrl: string): string {
    return `You are an SDR writing a 4-sentence cold B2B email to a car-rental business owner.
You represent REIZ — a white-label car-rental SaaS platform built on Next.js.

KEY FACTS to weave in (don't list them — pick what fits naturally):
- Setup: $250 one-time, includes first month
- Subscription: $149/month (everything: hosting, SSL, support, SEO content)
- Tech: Next.js (the stack used by Nike, Netflix, TikTok)
- Live cases: ${demoUrl} (our flagship), merent.ge (Georgia — launched in 4 days, fully their branding)
- Languages, currencies, payments — all configurable
- Telegram bot for instant booking notifications

TONE: peer-to-peer, direct, no formal "Dear Sir/Madam". For Russian use "вы". NO marketing fluff.

STRICT REQUIREMENTS:
- Body: exactly 4 short sentences. Plain text, no bullets, no headers.
- Refer to the recipient by their COMPANY NAME (given in metadata) — never by URL.
- Mention ONE specific detail you noticed from their website excerpt (cars, locations, features) — prove you actually looked.
- Include the live demo link exactly once: ${demoUrl} (woven naturally — e.g. "посмотрите как выглядит: ${demoUrl}").
- End body with: "2-мин демо?" (Russian) or "2-min demo?" (English equivalent).
- Sign body as: "— ${senderName}" (and only that — no name, no title above it).
- Subject: STRICTLY ≤ 6 words and ≤ 60 characters. NO ALL-CAPS. NO website meta-title text. Be intriguing, not salesy.

Output STRICT JSON only: {"subject": "...", "body": "..."}.
Do NOT wrap in markdown. Do NOT add commentary or anything outside the JSON.`;
}

function demoUrlForLanguage(language: string): string {
    return language === 'en' ? 'https://reiz.com.ua/en' : 'https://reiz.com.ua/ru';
}

class LeadAIService {
    private readonly apiKey = env.GEMINI_API_KEY || '';

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Generate the initial cold email for a lead.
     */
    async generateInitial(lead: LeadInput): Promise<GeneratedEmail> {
        if (!this.isConfigured()) {
            return {...this.fallbackTemplate(lead), usedAi: false};
        }
        try {
            const ai = await this.callGemini(lead);
            return {...ai, usedAi: true};
        } catch (err: any) {
            const reason = err?.message ?? String(err);
            logger.error(`[lead-ai] Gemini call failed for ${lead.companyName}: ${reason}`);
            return {...this.fallbackTemplate(lead), usedAi: false, failureReason: reason.slice(0, 200)};
        }
    }

    /**
     * Follow-ups don't need full personalization — they reference the
     * previous thread, so a deterministic localized template is fine
     * (and preserves Gemini quota for the high-leverage initial emails).
     */
    buildFollowUp(lead: LeadInput, kind: 'fu_3d' | 'fu_7d' | 'breakup_14d'): GeneratedEmail {
        const isRu = lead.language === 'ru' || ['KZ', 'AM'].includes(lead.country);
        const senderName = env.OUTREACH_SENDER_NAME;
        const demoUrl = demoUrlForLanguage(isRu ? 'ru' : 'en');

        if (kind === 'fu_3d') {
            return isRu
                ? {
                    subject: 'Re: REIZ',
                    body: `Поднимаю тред на случай, если пропустили.\n\nЖивой кейс — merent.ge: тот же движок, полностью в их брендинге, запустили за 4 дня. Наш флагман: ${demoUrl}. Если интересно — 2-мин видео покажу.\n\n— ${senderName}`,
                    usedAi: false,
                }
                : {
                    subject: 'Re: REIZ',
                    body: `Bumping in case you missed this.\n\nLive case — merent.ge: same engine, fully their branding, launched in 4 days. Flagship: ${demoUrl}. Want a 2-min walkthrough?\n\n— ${senderName}`,
                    usedAi: false,
                };
        }

        if (kind === 'fu_7d') {
            return isRu
                ? {
                    subject: 'Последний пинг по сайту',
                    body: `Понимаю, что не на первом месте.\n\nНо если сайт сейчас на Tilda/WordPress — это -30% мобильной конверсии для туристов. У нас Next.js, $149/мес, без подрядчиков. Стоит 10 минут на демо или нет?\n\n— ${senderName}`,
                    usedAi: false,
                }
                : {
                    subject: 'Last ping about your site',
                    body: `I get it's not top-of-mind right now.\n\nBut if you're on Tilda/WordPress — that's -30% mobile conversion on tourist traffic. We're on Next.js, $149/mo, no contractors. Worth a 10-min look?\n\n— ${senderName}`,
                    usedAi: false,
                };
        }

        // breakup
        return isRu
            ? {
                subject: 'Закрываю тред',
                body: `Если не приоритет — без проблем, не буду беспокоить.\n\nЕсли в будущем понадобится — пишите: @Reiz_Rental в Telegram.\n\n— ${senderName}`,
                usedAi: false,
            }
            : {
                subject: 'Closing the loop',
                body: `If it's not a priority right now — totally fine, won't bother you again.\n\nIf this comes up later: @Reiz_Rental on Telegram.\n\n— ${senderName}`,
                usedAi: false,
            };
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
            systemInstruction: {parts: [{text: buildSystemPrompt(senderName, demoUrl)}]},
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

    private fallbackTemplate(lead: LeadInput): {subject: string; body: string} {
        const isRu = lead.language === 'ru' || ['KZ', 'AM'].includes(lead.country);
        const senderName = env.OUTREACH_SENDER_NAME;
        const demoUrl = demoUrlForLanguage(isRu ? 'ru' : 'en');
        // Cap subject to 60 chars: short company names work, long ones get truncated.
        const cap = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

        if (isRu) {
            const greet = lead.ownerName ? `Здравствуйте, ${lead.ownerName}.` : 'Здравствуйте.';
            const subject = cap(`${lead.companyName}: сайт за 4 дня?`, 60);
            return {
                subject,
                body:
                    `${greet}\n\n` +
                    `Заметил ${lead.companyName} в ${lead.city}. ` +
                    `Мы делаем готовые сайты для автопрокатов на Next.js — запустили merent.ge в Тбилиси за 4 дня в их брендинге. ` +
                    `Живой пример: ${demoUrl}. Подписка $149/мес, без $8–15K на разработку с нуля.\n\n` +
                    `2-мин демо?\n\n` +
                    `— ${senderName}`,
            };
        }
        const greet = lead.ownerName ? `Hi ${lead.ownerName},` : 'Hi,';
        const subject = cap(`${lead.companyName}: site in 4 days?`, 60);
        return {
            subject,
            body:
                `${greet}\n\n` +
                `Spotted ${lead.companyName} in ${lead.city}. ` +
                `We build turnkey car-rental sites on Next.js — launched merent.ge in Tbilisi in 4 days under their full branding. ` +
                `Live demo: ${demoUrl}. $149/month subscription instead of $8–15K custom builds.\n\n` +
                `2-min demo?\n\n` +
                `— ${senderName}`,
        };
    }
}

export default new LeadAIService();
