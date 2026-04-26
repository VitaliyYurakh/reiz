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
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are a founder writing a 4-sentence cold B2B email to a car-rental business owner.
You sell REIZ — a white-label car-rental SaaS platform built on Next.js.

KEY FACTS to weave in (don't list them — pick what fits):
- Setup: $250 one-time, includes first month
- Subscription: $149/month (everything: hosting, SSL, support, SEO content)
- Tech: Next.js (the stack used by Nike, Netflix, TikTok)
- Live cases: reiz.com.ua (Ukraine flagship), merent.ge (Georgia, launched in 4 days, fully their branding)
- Languages, currencies, payments — all configurable
- Telegram bot for instant booking notifications

TONE: founder-to-founder, direct, no formal "Dear Sir". Use "ты" if Russian. NO marketing fluff.

REQUIREMENTS:
- Exactly 4 sentences in body
- Mention ONE specific detail from the recipient's website to prove you actually looked
- End with: "2-min demo?" (or local-language equivalent)
- Subject: max 6 words, lowercase except names — make it intriguing, not salesy

Output STRICT JSON only: {"subject": "...", "body": "..."}.
Do NOT wrap in markdown. Do NOT add commentary.`;

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
            return this.fallbackTemplate(lead);
        }
        try {
            return await this.callGemini(lead);
        } catch (err: any) {
            logger.error(`[lead-ai] Gemini call failed for ${lead.companyName}: ${err.message}`);
            return this.fallbackTemplate(lead);
        }
    }

    /**
     * Follow-ups don't need full personalization — they reference the
     * previous thread, so a deterministic localized template is fine
     * (and preserves Gemini quota for the high-leverage initial emails).
     */
    buildFollowUp(lead: LeadInput, kind: 'fu_3d' | 'fu_7d' | 'breakup_14d'): GeneratedEmail {
        const isRu = lead.language === 'ru' || ['KZ', 'AM'].includes(lead.country);

        if (kind === 'fu_3d') {
            return isRu
                ? {
                    subject: 'Re: REIZ',
                    body: `Подняли тред на случай, если пропустили.\n\nКейс — merent.ge: тот же движок, полностью в их брендинге, запустили за 4 дня. Если интересно — 2-мин видео покажу.\n\n— Марьян`,
                }
                : {
                    subject: 'Re: REIZ',
                    body: `Bumping in case you missed this.\n\nLive case — merent.ge: same engine, fully their branding, launched in 4 days. Want a 2-min walkthrough?\n\n— Marian`,
                };
        }

        if (kind === 'fu_7d') {
            return isRu
                ? {
                    subject: 'Последний пинг по сайту для ' + lead.companyName,
                    body: `Понимаю, что у тебя не на первом месте.\n\nНо если сайт сейчас на Tilda/WordPress — это -30% мобильной конверсии для туристов. У нас Next.js, $149/мес, без подрядчиков. Мне правда интересно — стоит подумать или нет?\n\n— Марьян`,
                }
                : {
                    subject: 'Last ping about your site',
                    body: `I get it's not top-of-mind right now.\n\nBut if you're on Tilda/WordPress — that's -30% mobile conversion on tourist traffic. We're on Next.js, $149/mo, no contractors. Worth a 10-min look?\n\n— Marian`,
                };
        }

        // breakup
        return isRu
            ? {
                subject: 'Закрываю тред',
                body: `Если не приоритет — без проблем, не буду беспокоить.\n\nЕсли в будущем понадобится — пиши: @Reiz_Rental в Telegram.\n\n— Марьян`,
            }
            : {
                subject: 'Closing the loop',
                body: `If it's not a priority right now — totally fine, won't bother you again.\n\nIf this comes up later: @Reiz_Rental on Telegram.\n\n— Marian`,
            };
    }

    private async callGemini(lead: LeadInput): Promise<GeneratedEmail> {
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

        const body = {
            systemInstruction: {parts: [{text: SYSTEM_PROMPT}]},
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

    private fallbackTemplate(lead: LeadInput): GeneratedEmail {
        const isRu = lead.language === 'ru' || ['KZ', 'AM'].includes(lead.country);
        const greet = lead.ownerName ? (isRu ? `Привет, ${lead.ownerName}.` : `Hi ${lead.ownerName},`) : (isRu ? 'Привет.' : 'Hi,');
        if (isRu) {
            return {
                subject: `${lead.companyName} + Next.js за 4 дня?`,
                body:
                    `${greet}\n\n` +
                    `Зашёл на ${lead.website ?? 'ваш сайт'} — увидел, что работаете в ${lead.city}. ` +
                    `Мы сделали платформу автопроката на Next.js, запустили merent.ge в Тбилиси за 4 дня в их брендинге. ` +
                    `Подписка $149/мес, замена кастомной разработки за $8–15K.\n\n` +
                    `2-мин демо?\n\n` +
                    `— Марьян, REIZ`,
            };
        }
        return {
            subject: `${lead.companyName} + Next.js in 4 days?`,
            body:
                `${greet}\n\n` +
                `Saw ${lead.website ?? 'your site'} — you operate in ${lead.city}. ` +
                `We built a car-rental SaaS on Next.js and launched merent.ge in Tbilisi in 4 days under their full branding. ` +
                `$149/month subscription, replaces $8–15K custom builds.\n\n` +
                `2-min demo?\n\n` +
                `— Marian, REIZ`,
        };
    }
}

export default new LeadAIService();
