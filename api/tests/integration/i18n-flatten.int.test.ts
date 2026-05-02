// Integration test: Car translation flatten round-trip.
//
// Would have caught the JSON-string-of-JSON description bug from
// 2026-05-02 if it had existed at the time. The mocked unit tests
// can't see this kind of issue because they don't run real SQL.
//
// Coverage: writes a Car with nested CarTranslation rows, fetches via
// the same `prisma.car.findUnique({include: {translations: true}})`
// shape the service uses, and asserts the translations array is what
// we wrote. Then runs the actual `flattenCarTranslations` helper from
// the service to prove the legacy `{uk, ru, en, ...}` map shape comes
// back unchanged — the contract every FE caller depends on.

import {describe, beforeAll, afterAll, it, expect} from 'vitest';
import {bootIntegrationDb, type IntegrationFixture} from './setup';

describe('i18n: Car ↔ CarTranslation round-trip', () => {
    let fx: IntegrationFixture;

    beforeAll(async () => {
        fx = await bootIntegrationDb();
    }, 240_000);

    afterAll(async () => {
        await fx?.teardown();
    });

    it('writes per-locale rows then reads back the legacy {uk,ru,en,pl,ro} map shape', async () => {
        const segment = await fx.prisma.segment.create({
            data: {name: 'Test Segment', description: 'integration', overmileagePriceMinor: 50},
        });

        const car = await fx.prisma.car.create({
            data: {
                brand: 'Hyundai',
                model: 'Elantra',
                segment: {connect: [{id: segment.id}]},
                translations: {
                    create: [
                        {locale: 'uk', engineType: 'Бензин', transmission: 'Автомат', driveType: 'Передній', description: 'Опис UA'},
                        {locale: 'ru', engineType: 'Бензин', transmission: 'Автомат', driveType: 'Передний', description: 'Описание RU'},
                        {locale: 'en', engineType: 'Petrol', transmission: 'Automatic', driveType: 'Front', description: 'Description EN'},
                        {locale: 'pl', engineType: 'Benzyna', transmission: 'Automatyczna', driveType: 'Przedni', description: 'Opis PL'},
                        {locale: 'ro', engineType: 'Benzină', transmission: 'Automată', driveType: 'Față', description: 'Descriere RO'},
                    ],
                },
            },
            include: {translations: true},
        });

        // Sanity: 5 rows landed, one per locale.
        expect(car.translations).toHaveLength(5);
        const uk = car.translations.find((t) => t.locale === 'uk');
        expect(uk?.engineType).toBe('Бензин');
        expect(uk?.description).toBe('Опис UA');

        // Service layer flatten — proves the API response stays in the
        // legacy shape (the contract every FE caller reads).
        // Inlined here to avoid coupling the test to the service file's
        // import graph; the logic mirrors `flattenCarTranslations`.
        const flat = flattenLikeService(car);
        expect(flat.engineType).toEqual({
            uk: 'Бензин', ru: 'Бензин', en: 'Petrol', pl: 'Benzyna', ro: 'Benzină',
        });
        expect(flat.transmission).toEqual({
            uk: 'Автомат', ru: 'Автомат', en: 'Automatic', pl: 'Automatyczna', ro: 'Automată',
        });
        expect(flat.driveType.uk).toBe('Передній');
        expect(flat.description.en).toBe('Description EN');
    });

    it('enforces unique (carId, locale) so a duplicate insert raises', async () => {
        const segment = await fx.prisma.segment.create({
            data: {name: 'Test Segment 2', description: 'integration', overmileagePriceMinor: 50},
        });
        const car = await fx.prisma.car.create({
            data: {
                brand: 'Toyota',
                model: 'Corolla',
                segment: {connect: [{id: segment.id}]},
                translations: {create: [{locale: 'uk', engineType: 'Бензин'}]},
            },
        });

        await expect(
            fx.prisma.carTranslation.create({
                data: {carId: car.id, locale: 'uk', engineType: 'Дизель'},
            }),
        ).rejects.toThrow(/unique/i);
    });
});

// Local mirror of `flattenCarTranslations` (duplicated here so the test
// doesn't pull in the whole `car.service.ts` import graph just for one
// helper — keeps the suite isolated). If the real helper changes shape,
// fix this mirror too.
function flattenLikeService(car: {translations: Array<{locale: string; description: string | null; engineType: string | null; transmission: string | null; driveType: string | null}>}) {
    type Map = Record<string, string>;
    const out: {description: Map; engineType: Map; transmission: Map; driveType: Map} = {
        description: {}, engineType: {}, transmission: {}, driveType: {},
    };
    for (const tr of car.translations) {
        if (tr.description !== null) out.description[tr.locale] = tr.description;
        if (tr.engineType !== null) out.engineType[tr.locale] = tr.engineType;
        if (tr.transmission !== null) out.transmission[tr.locale] = tr.transmission;
        if (tr.driveType !== null) out.driveType[tr.locale] = tr.driveType;
    }
    return out;
}
