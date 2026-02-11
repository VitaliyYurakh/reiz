/**
 * Cleanup duplicate clients.
 *
 * Groups clients by normalized phone number.
 * For each group: keeps the oldest record, reassigns all related entities
 * (rentalRequests, reservations, rentals, transactions, documents)
 * to the keeper, then deletes the duplicates.
 *
 * Usage:  npx tsx prisma/cleanup-duplicates.ts
 * Add --dry-run to preview without making changes.
 */

import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
const DRY_RUN = process.argv.includes('--dry-run');

function normalizePhone(phone: string): string {
    // Strip everything except digits
    const digits = phone.replace(/\D/g, '');
    return digits;
}

async function main() {
    console.log(DRY_RUN ? '=== DRY RUN (no changes will be made) ===' : '=== LIVE RUN ===');
    console.log('');

    // 1. Fetch all non-deleted clients
    const allClients = await prisma.client.findMany({
        where: {deletedAt: null},
        orderBy: {createdAt: 'asc'},
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            createdAt: true,
            source: true,
            notes: true,
            driverLicenseNo: true,
            passportNo: true,
            nationalId: true,
            address: true,
            city: true,
            rating: true,
        },
    });

    console.log(`Total non-deleted clients: ${allClients.length}`);

    // 2. Group by normalized phone
    const phoneGroups = new Map<string, typeof allClients>();

    for (const client of allClients) {
        if (!client.phone) continue;
        const key = normalizePhone(client.phone);
        if (key.length < 6) continue; // skip very short phones

        const group = phoneGroups.get(key) || [];
        group.push(client);
        phoneGroups.set(key, group);
    }

    // 3. Also group by email (case-insensitive) for clients without matching phone
    const emailGroups = new Map<string, typeof allClients>();
    const alreadyGroupedIds = new Set<number>();

    for (const [, group] of phoneGroups) {
        if (group.length > 1) {
            for (const c of group) alreadyGroupedIds.add(c.id);
        }
    }

    for (const client of allClients) {
        if (alreadyGroupedIds.has(client.id)) continue;
        if (!client.email) continue;
        const key = client.email.toLowerCase().trim();

        const group = emailGroups.get(key) || [];
        group.push(client);
        emailGroups.set(key, group);
    }

    // 4. Collect duplicate groups
    const duplicateGroups: Array<{keeper: typeof allClients[0]; duplicates: typeof allClients}> = [];

    for (const [phone, group] of phoneGroups) {
        if (group.length <= 1) continue;

        // Keeper = the one with most data (rating, docs, etc), or oldest
        const sorted = [...group].sort((a, b) => {
            // Prefer one with rating
            if (a.rating && !b.rating) return -1;
            if (!a.rating && b.rating) return 1;
            // Prefer one with more filled fields
            const fieldsA = [a.driverLicenseNo, a.passportNo, a.nationalId, a.address, a.email, a.notes].filter(Boolean).length;
            const fieldsB = [b.driverLicenseNo, b.passportNo, b.nationalId, b.address, b.email, b.notes].filter(Boolean).length;
            if (fieldsA !== fieldsB) return fieldsB - fieldsA;
            // Oldest first
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        duplicateGroups.push({
            keeper: sorted[0],
            duplicates: sorted.slice(1),
        });
    }

    for (const [email, group] of emailGroups) {
        if (group.length <= 1) continue;

        const sorted = [...group].sort((a, b) => {
            if (a.rating && !b.rating) return -1;
            if (!a.rating && b.rating) return 1;
            const fieldsA = [a.driverLicenseNo, a.passportNo, a.nationalId, a.address, a.phone, a.notes].filter(Boolean).length;
            const fieldsB = [b.driverLicenseNo, b.passportNo, b.nationalId, b.address, b.phone, b.notes].filter(Boolean).length;
            if (fieldsA !== fieldsB) return fieldsB - fieldsA;
            return a.createdAt.getTime() - b.createdAt.getTime();
        });

        duplicateGroups.push({
            keeper: sorted[0],
            duplicates: sorted.slice(1),
        });
    }

    if (duplicateGroups.length === 0) {
        console.log('\nNo duplicates found. Database is clean!');
        return;
    }

    const totalDuplicates = duplicateGroups.reduce((sum, g) => sum + g.duplicates.length, 0);
    console.log(`\nFound ${duplicateGroups.length} duplicate groups, ${totalDuplicates} records to merge/delete:\n`);

    for (const {keeper, duplicates} of duplicateGroups) {
        console.log(`  KEEP: #${keeper.id} ${keeper.firstName} ${keeper.lastName} | ${keeper.phone} | ${keeper.email || '—'} | ${keeper.source || '—'}`);
        for (const dup of duplicates) {
            console.log(`    DEL: #${dup.id} ${dup.firstName} ${dup.lastName} | ${dup.phone} | ${dup.email || '—'} | ${dup.source || '—'}`);
        }
        console.log('');
    }

    if (DRY_RUN) {
        console.log('Dry run complete. Run without --dry-run to apply changes.');
        return;
    }

    // 5. Execute merges in transactions
    let merged = 0;
    for (const {keeper, duplicates} of duplicateGroups) {
        const dupIds = duplicates.map((d) => d.id);

        await prisma.$transaction(async (tx) => {
            // Reassign rental requests
            await tx.rentalRequest.updateMany({
                where: {clientId: {in: dupIds}},
                data: {clientId: keeper.id},
            });

            // Reassign reservations
            await tx.reservation.updateMany({
                where: {clientId: {in: dupIds}},
                data: {clientId: keeper.id},
            });

            // Reassign rentals
            await tx.rental.updateMany({
                where: {clientId: {in: dupIds}},
                data: {clientId: keeper.id},
            });

            // Reassign transactions
            await tx.transaction.updateMany({
                where: {clientId: {in: dupIds}},
                data: {clientId: keeper.id},
            });

            // Reassign documents
            await tx.clientDocument.updateMany({
                where: {clientId: {in: dupIds}},
                data: {clientId: keeper.id},
            });

            // Fill missing fields on keeper from duplicates
            const updates: Record<string, any> = {};
            for (const dup of duplicates) {
                if (!keeper.email && dup.email) updates.email = dup.email;
                if (!keeper.driverLicenseNo && dup.driverLicenseNo) updates.driverLicenseNo = dup.driverLicenseNo;
                if (!keeper.passportNo && dup.passportNo) updates.passportNo = dup.passportNo;
                if (!keeper.nationalId && dup.nationalId) updates.nationalId = dup.nationalId;
                if (!keeper.address && dup.address) updates.address = dup.address;
                if (!keeper.city && dup.city) updates.city = dup.city;
                if (!keeper.notes && dup.notes) updates.notes = dup.notes;
            }

            if (Object.keys(updates).length > 0) {
                await tx.client.update({where: {id: keeper.id}, data: updates});
            }

            // Soft-delete duplicates
            await tx.client.updateMany({
                where: {id: {in: dupIds}},
                data: {deletedAt: new Date()},
            });
        });

        merged += dupIds.length;
        console.log(`  Merged ${dupIds.length} duplicate(s) into #${keeper.id} ${keeper.firstName} ${keeper.lastName}`);
    }

    console.log(`\nDone! Merged ${merged} duplicate records. They are soft-deleted and can be restored if needed.`);
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
