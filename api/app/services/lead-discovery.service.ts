/**
 * Lead Discovery — pulls car-rental businesses from Google Places API
 * for our target Russian-speaking markets and seeds them as Lead rows.
 *
 * Falls back to a no-op when GOOGLE_PLACES_API_KEY is not configured.
 *
 * Free tier: $200/month credit ≈ 5000 Text Search calls. We use one call
 * per (country, city) per run, keeping runs well within free quota.
 */
import {env} from '../config/env';
import {logger, prisma, LeadSource, LeadStatus} from '../utils';

interface TargetCity {
    country: string; // ISO-2
    city: string;
}

// Russian-speaking owners-first markets. Georgia is intentionally excluded —
// already a client (Merent.ge) and we don't poach from their territory.
export const DEFAULT_TARGETS: TargetCity[] = [
    {country: 'TR', city: 'Antalya'},
    {country: 'TR', city: 'Alanya'},
    {country: 'TR', city: 'Side'},
    {country: 'TR', city: 'Kemer'},
    {country: 'TR', city: 'Istanbul'},
    {country: 'TR', city: 'Bodrum'},
    {country: 'ME', city: 'Budva'},
    {country: 'ME', city: 'Tivat'},
    {country: 'ME', city: 'Bar'},
    {country: 'ME', city: 'Podgorica'},
    {country: 'RS', city: 'Belgrade'},
    {country: 'RS', city: 'Novi Sad'},
    {country: 'AM', city: 'Yerevan'},
    {country: 'AM', city: 'Gyumri'},
    {country: 'TH', city: 'Phuket'},
    {country: 'TH', city: 'Pattaya'},
    {country: 'TH', city: 'Koh Samui'},
    {country: 'ID', city: 'Canggu'},
    {country: 'ID', city: 'Seminyak'},
    {country: 'ID', city: 'Ubud'},
    {country: 'KZ', city: 'Almaty'},
    {country: 'KZ', city: 'Astana'},
];

interface PlaceResult {
    place_id: string;
    name: string;
    formatted_address?: string;
    website?: string;
    international_phone_number?: string;
    formatted_phone_number?: string;
    business_status?: string;
}

class LeadDiscoveryService {
    private readonly apiKey = env.GOOGLE_PLACES_API_KEY || '';

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Run discovery for all default targets. Returns counts.
     * Idempotent — uses upsert on googlePlaceId.
     */
    async discoverAll(targets: TargetCity[] = DEFAULT_TARGETS) {
        if (!this.isConfigured()) {
            logger.warn('[lead-discovery] GOOGLE_PLACES_API_KEY missing — skipping discovery');
            return {created: 0, skipped: 0, total: 0, configured: false};
        }

        let created = 0;
        let skipped = 0;
        let total = 0;
        for (const t of targets) {
            try {
                const results = await this.searchCity(t);
                total += results.length;
                for (const place of results) {
                    const existing = await prisma.lead.findUnique({
                        where: {googlePlaceId: place.place_id},
                    });
                    if (existing) {
                        skipped++;
                        continue;
                    }
                    // Skip permanently-closed businesses
                    if (place.business_status && place.business_status !== 'OPERATIONAL') {
                        skipped++;
                        continue;
                    }
                    await prisma.lead.create({
                        data: {
                            source: LeadSource.GOOGLE_PLACES,
                            googlePlaceId: place.place_id,
                            companyName: place.name,
                            country: t.country,
                            city: t.city,
                            website: place.website ?? null,
                            phone: place.international_phone_number ?? place.formatted_phone_number ?? null,
                            language: 'ru',
                            status: LeadStatus.NEW,
                        },
                    });
                    created++;
                }
                // Polite pacing — avoid hitting QPS limits
                await sleep(250);
            } catch (err: any) {
                logger.error(`[lead-discovery] ${t.country}/${t.city} failed: ${err.message}`);
            }
        }
        logger.info(`[lead-discovery] done — total=${total}, created=${created}, skipped=${skipped}`);
        return {created, skipped, total, configured: true};
    }

    /**
     * Text Search returns up to 20 results per page; we stop at one page (20 leads
     * per city) intentionally — quality > quantity for cold outreach.
     */
    private async searchCity(t: TargetCity): Promise<PlaceResult[]> {
        const query = `car rental in ${t.city}`;
        const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        url.searchParams.set('query', query);
        url.searchParams.set('key', this.apiKey);

        const res = await fetchWithTimeout(url.toString(), 10_000);
        if (!res.ok) throw new Error(`Places HTTP ${res.status}`);
        const data = await res.json() as {status: string; results?: PlaceResult[]; error_message?: string};
        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            throw new Error(`Places API ${data.status}: ${data.error_message ?? ''}`);
        }
        const results = data.results ?? [];

        // For each, fetch Place Details to get website + phone (Text Search alone doesn't include them)
        const detailed: PlaceResult[] = [];
        for (const r of results) {
            try {
                const detail = await this.placeDetails(r.place_id);
                detailed.push({...r, ...detail});
                await sleep(120);
            } catch {
                detailed.push(r);
            }
        }
        return detailed;
    }

    private async placeDetails(placeId: string): Promise<Partial<PlaceResult>> {
        const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
        url.searchParams.set('place_id', placeId);
        url.searchParams.set('fields', 'website,international_phone_number,formatted_phone_number,business_status');
        url.searchParams.set('key', this.apiKey);

        const res = await fetchWithTimeout(url.toString(), 10_000);
        if (!res.ok) return {};
        const data = await res.json() as {result?: Partial<PlaceResult>};
        return data.result ?? {};
    }
}

async function fetchWithTimeout(url: string, ms: number) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, {signal: ctrl.signal});
    } finally {
        clearTimeout(t);
    }
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

export default new LeadDiscoveryService();
