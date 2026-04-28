import {prisma} from '../utils';

const NBU_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';
const SUPPORTED = ['USD', 'EUR', 'GBP', 'PLN', 'CZK', 'RON'];

class FxRateService {
    /**
     * Get the rate for a given currency on a given day.
     * Tries DB first; if missing, fetches NBU and caches.
     * Returns UAH per 1 unit of currency.
     */
    async getRate(currency: string, date?: Date | string) {
        const upper = currency.toUpperCase();
        if (upper === 'UAH') return {rate: 1.0, source: 'fixed', date: new Date()};

        const day = date ? new Date(date) : new Date();
        day.setUTCHours(0, 0, 0, 0);

        const existing = await prisma.dailyFxRate.findUnique({
            where: {date_currency: {date: day, currency: upper}},
        });
        if (existing) return {rate: existing.rate, source: existing.source, date: existing.date};

        // NBU's `exchange?json` endpoint without `date=` returns *today's* rates,
        // which silently mis-fixed historical rates. Always pass `date=YYYYMMDD`
        // so a request for 2026-04-04 actually returns the rate from 2026-04-04
        // (NBU keeps decades of history). Used for partner statements where the
        // commission is paid in UAH at the rate that was in force on the day
        // of the rental.
        const ymd = `${day.getUTCFullYear()}${String(day.getUTCMonth() + 1).padStart(2, '0')}${String(day.getUTCDate()).padStart(2, '0')}`;
        const url = `${NBU_URL}&date=${ymd}`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`NBU returned ${res.status}`);
            const data = await res.json() as Array<{cc: string; rate: number; exchangedate: string}>;
            const found = data.find((d) => d.cc === upper);
            if (!found) {
                // Currency not in NBU table — return null so caller can decide.
                return null;
            }
            const saved = await prisma.dailyFxRate.create({
                data: {date: day, currency: upper, rate: found.rate, source: 'NBU'},
            });
            return {rate: saved.rate, source: saved.source, date: saved.date};
        } catch (err) {
            console.error(`NBU fetch failed for ${upper} on ${ymd}`, err);
            // Last-ditch fallback: most recent saved rate for this currency
            // dated on or before the requested day. Avoids returning a future
            // rate for a back-dated query.
            const fallback = await prisma.dailyFxRate.findFirst({
                where: {currency: upper, date: {lte: day}},
                orderBy: {date: 'desc'},
            });
            if (fallback) return {rate: fallback.rate, source: 'stale', date: fallback.date};
            return null;
        }
    }

    async listToday() {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const rates = await Promise.all(
            SUPPORTED.map(async (cc) => {
                const r = await this.getRate(cc, today);
                return r ? {currency: cc, ...r} : null;
            }),
        );
        return rates.filter(Boolean);
    }

    /**
     * Manually override / set a rate. Use case: NBU is down or admin wants a
     * specific rate for a back-dated transaction.
     */
    async setManualRate(currency: string, rate: number, date?: Date | string) {
        const upper = currency.toUpperCase();
        const day = date ? new Date(date) : new Date();
        day.setUTCHours(0, 0, 0, 0);
        return await prisma.dailyFxRate.upsert({
            where: {date_currency: {date: day, currency: upper}},
            create: {date: day, currency: upper, rate, source: 'manual'},
            update: {rate, source: 'manual'},
        });
    }
}

export default new FxRateService();
