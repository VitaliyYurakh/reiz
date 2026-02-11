import {prisma, createHashedPassword} from '../utils';

class UserService {
    private selectWithoutPass = {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
    };

    async getAll() {
        return prisma.user.findMany({
            select: this.selectWithoutPass,
            orderBy: {id: 'asc'},
        });
    }

    async getOne(id: number) {
        return prisma.user.findUnique({
            where: {id},
            select: this.selectWithoutPass,
        });
    }

    async create(data: {email: string; password: string; name: string; role: string; permissions: any}) {
        const hashedPassword = await createHashedPassword(data.password);
        return prisma.user.create({
            data: {
                email: data.email,
                pass: hashedPassword,
                name: data.name,
                role: data.role,
                permissions: data.permissions || {},
            },
            select: this.selectWithoutPass,
        });
    }

    async update(id: number, data: {name?: string; role?: string; permissions?: any; isActive?: boolean}) {
        return prisma.user.update({
            where: {id},
            data,
            select: this.selectWithoutPass,
        });
    }

    async changePassword(id: number, newPassword: string) {
        const hashedPassword = await createHashedPassword(newPassword);
        return prisma.user.update({
            where: {id},
            data: {pass: hashedPassword},
            select: this.selectWithoutPass,
        });
    }

    async delete(id: number) {
        return prisma.user.delete({where: {id}});
    }
}

export default new UserService();
