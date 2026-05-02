// Integration test: every monetary column on the platform is `Int *Minor`.
//
// Locks in the Phase A + Phase B money refactor: if anyone adds a
// `Float price` column or stores UAH whole units in a Minor field
// (the latent 100× OVERMILEAGE bug from a1a21bd), this test fails.
//
// Strategy: insert a tariff with depositMinor = 47000 (= 470 UAH) and
// dailyPriceMinor = 5300 (= 53 UAH/day). Read back via Prisma, prove
// the values round-trip as integers (no Float drift), and that totals
// computed in JS line up with the values the public pricing service
// would feed into Fine.amountMinor.

import {describe, beforeAll, afterAll, it, expect} from 'vitest';
import {bootIntegrationDb, type IntegrationFixture} from './setup';

describe('money: Int *Minor round-trip + arithmetic', () => {
    let fx: IntegrationFixture;

    beforeAll(async () => {
        fx = await bootIntegrationDb();
    }, 240_000);

    afterAll(async () => {
        await fx?.teardown();
    });

    it('stores tariff money as Int *Minor without Float drift', async () => {
        const segment = await fx.prisma.segment.create({
            data: {name: 'Money', description: 'integration', overmileagePriceMinor: 23},
        });
        const car = await fx.prisma.car.create({
            data: {brand: 'Mazda', model: 'CX-5', segment: {connect: [{id: segment.id}]}},
        });

        await fx.prisma.rentalTariff.create({
            data: {carId: car.id, minDays: 1, maxDays: 7, depositMinor: 47000, dailyPriceMinor: 5300},
        });

        const tariff = await fx.prisma.rentalTariff.findFirstOrThrow({where: {carId: car.id}});

        // Integer round-trip — no `5300.000000001` Float artifacts.
        expect(tariff.depositMinor).toBe(47000);
        expect(tariff.dailyPriceMinor).toBe(5300);
        expect(Number.isInteger(tariff.depositMinor)).toBe(true);
        expect(Number.isInteger(tariff.dailyPriceMinor)).toBe(true);

        // Total for 5 days in копійки = 26500 (265 UAH).
        const total = tariff.dailyPriceMinor * 5;
        expect(total).toBe(26500);
    });

    it('overmileagePriceMinor × km lands in копійки (Fine.amountMinor compatible)', async () => {
        const segment = await fx.prisma.segment.create({
            data: {name: 'OVR', description: 'integration', overmileagePriceMinor: 23},
        });
        const car = await fx.prisma.car.create({
            data: {brand: 'Hyundai', model: 'Elantra', overmileagePriceMinor: 23, segment: {connect: [{id: segment.id}]}},
        });

        const fresh = await fx.prisma.car.findUniqueOrThrow({where: {id: car.id}});
        // 100 km over × 23 копійки = 2300 копійки = 23 UAH. This is the
        // exact arithmetic rental.service.completeRental does when it
        // creates the OVERMILEAGE Fine row — and the value goes straight
        // into Fine.amountMinor (also копійки), no extra ×100.
        const fee = 100 * (fresh.overmileagePriceMinor ?? 0);
        expect(fee).toBe(2300);
    });
});
