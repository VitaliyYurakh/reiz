/**
 * Lead Enrichment — visits the lead's website, scrapes a snippet of text
 * for personalization, and tries to extract a contact email if Google Places
 * didn't surface one.
 *
 * No external API needed. Just HTTP fetch + regex.
 *
 * Lead status flow handled here:
 *   NEW → ENRICHED (email parsed)  → bumped to READY automatically
 *   NEW → DISQUALIFIED (no website OR no email found)
 */
import {logger, prisma, LeadStatus} from '../utils';

const EMAIL_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const CONTACT_PATHS = ['', '/contact', '/contacts', '/about', '/about-us', '/контакты', '/контакти', '/iletisim'];

// Pages we don't want to scrape — typically bot-bait or noisy
const SKIP_HOSTS = ['facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com'];

class LeadEnrichmentService {
    /**
     * Process up to `batchSize` NEW leads with website set. Polite pacing
     * so a single sweep doesn't hammer one host.
     */
    async enrichBatch(batchSize = 5) {
        const leads = await prisma.lead.findMany({
            where: {status: LeadStatus.NEW, website: {not: null}},
            take: batchSize,
            orderBy: {createdAt: 'asc'},
        });

        let enriched = 0;
        let disqualified = 0;

        for (const lead of leads) {
            try {
                if (!lead.website) {
                    await prisma.lead.update({
                        where: {id: lead.id},
                        data: {status: LeadStatus.DISQUALIFIED},
                    });
                    disqualified++;
                    continue;
                }
                const host = new URL(lead.website).hostname.replace(/^www\./, '');
                if (SKIP_HOSTS.some((h) => host.includes(h))) {
                    await prisma.lead.update({
                        where: {id: lead.id},
                        data: {status: LeadStatus.DISQUALIFIED, pausedReason: 'social-only website'},
                    });
                    disqualified++;
                    continue;
                }

                const {email, content} = await this.fetchAndExtract(lead.website);

                const finalEmail = lead.email || email;
                if (!finalEmail) {
                    await prisma.lead.update({
                        where: {id: lead.id},
                        data: {
                            status: LeadStatus.DISQUALIFIED,
                            pausedReason: 'no email found on website',
                            websiteContent: content ?? null,
                        },
                    });
                    disqualified++;
                    continue;
                }

                await prisma.lead.update({
                    where: {id: lead.id},
                    data: {
                        email: finalEmail,
                        websiteContent: content ?? null,
                        // Skip ENRICHED — go straight to READY (email is the only gate)
                        status: LeadStatus.READY,
                    },
                });
                enriched++;
            } catch (err: any) {
                logger.warn(`[lead-enrichment] lead ${lead.id} failed: ${err.message}`);
                // Don't disqualify on transient errors — leave for retry next sweep
            }
            await sleep(500);
        }

        logger.info(`[lead-enrichment] batch done — enriched=${enriched}, disqualified=${disqualified}`);
        return {enriched, disqualified, processed: leads.length};
    }

    /**
     * Fetch home + a few common contact paths, return the first email found
     * and a short content snippet for AI personalization.
     */
    private async fetchAndExtract(websiteUrl: string): Promise<{email: string | null; content: string | null}> {
        const base = normalizeUrl(websiteUrl);
        let firstEmail: string | null = null;
        let homeContent: string | null = null;

        for (const path of CONTACT_PATHS) {
            try {
                const url = base + path;
                const res = await fetchWithTimeout(url, 8_000);
                if (!res.ok) continue;
                const html = await res.text();

                if (!firstEmail) {
                    const matches = html.match(EMAIL_REGEX);
                    if (matches?.length) {
                        // Prefer non-noreply addresses
                        const candidate = matches.find((m) => !/noreply|no-reply|wordfence|sentry/i.test(m)) ?? matches[0];
                        firstEmail = candidate.toLowerCase();
                    }
                }

                if (path === '' && !homeContent) {
                    homeContent = stripHtml(html).slice(0, 2000);
                }

                if (firstEmail && homeContent) break;
            } catch {
                /* skip path */
            }
        }
        return {email: firstEmail, content: homeContent};
    }
}

function normalizeUrl(input: string) {
    let s = input.trim();
    if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
    return s.replace(/\/+$/, '');
}

function stripHtml(html: string) {
    return html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function fetchWithTimeout(url: string, ms: number) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, {
            signal: ctrl.signal,
            headers: {
                // Pretend to be a real browser — too many sites 403 generic UAs
                'User-Agent': 'Mozilla/5.0 (compatible; ReizBot/1.0; +https://reiz.com.ua)',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
            },
        });
    } finally {
        clearTimeout(t);
    }
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export default new LeadEnrichmentService();
