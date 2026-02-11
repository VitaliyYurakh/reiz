import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const KEEP_ID = 8;  // Мар'ян Єдинак — correct phone format
    const DEL_ID = 1;   // Maryan Yedynak — bad phone format 972+972...

    const keeper = await prisma.client.findUnique({where: {id: KEEP_ID}});
    const dup = await prisma.client.findUnique({where: {id: DEL_ID}});

    if (!keeper || !dup) {
        console.error('Client not found');
        return;
    }

    console.log(`KEEP: #${keeper.id} ${keeper.firstName} ${keeper.lastName} | ${keeper.phone}`);
    console.log(`DEL:  #${dup.id} ${dup.firstName} ${dup.lastName} | ${dup.phone}`);

    await prisma.$transaction(async (tx) => {
        // Reassign all relations from #1 to #8
        const rq = await tx.rentalRequest.updateMany({where: {clientId: DEL_ID}, data: {clientId: KEEP_ID}});
        const rv = await tx.reservation.updateMany({where: {clientId: DEL_ID}, data: {clientId: KEEP_ID}});
        const rn = await tx.rental.updateMany({where: {clientId: DEL_ID}, data: {clientId: KEEP_ID}});
        const txn = await tx.transaction.updateMany({where: {clientId: DEL_ID}, data: {clientId: KEEP_ID}});
        const doc = await tx.clientDocument.updateMany({where: {clientId: DEL_ID}, data: {clientId: KEEP_ID}});

        console.log(`Moved: requests=${rq.count} reservations=${rv.count} rentals=${rn.count} transactions=${txn.count} docs=${doc.count}`);

        // Soft-delete the duplicate
        await tx.client.update({where: {id: DEL_ID}, data: {deletedAt: new Date()}});
        console.log(`Soft-deleted client #${DEL_ID}`);
    });

    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
