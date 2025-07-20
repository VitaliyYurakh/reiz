import {prisma} from '../utils';

class SegmentService {
    async getAll() {
        return await prisma.segment.findMany({
            include: {
                car: {
                    include: {
                        carPhoto: true,
                        carCountingRule: true,
                        rentalTariff: true,
                    },
                },
            },
        });
    }
}

export default new SegmentService();
