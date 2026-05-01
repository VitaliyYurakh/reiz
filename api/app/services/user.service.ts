import {UserRole} from '@prisma/client';
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

    async create(data: {email: string; password: string; name: string; role: UserRole; permissions: any}) {
        const hashedPassword = await createHashedPassword(data.password);
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                name: data.name,
                role: data.role,
                permissions: data.permissions || {},
            },
            select: this.selectWithoutPass,
        });
    }

    async update(id: number, data: {name?: string; role?: UserRole; permissions?: any; isActive?: boolean}) {
        // Deactivating an account must also invalidate all its existing sessions.
        // auth.middleware rejects tokens whose `tv` claim does not match tokenVersion,
        // so incrementing it here immediately revokes every outstanding JWT.
        const tokenVersionBump =
            data.isActive === false ? {tokenVersion: {increment: 1}} : {};

        return prisma.user.update({
            where: {id},
            data: {...data, ...tokenVersionBump},
            select: this.selectWithoutPass,
        });
    }

    async changePassword(id: number, newPassword: string) {
        const hashedPassword = await createHashedPassword(newPassword);
        // Bump tokenVersion so any session still holding an old JWT is logged out
        // (audit H-1). Without this, an attacker whose creds were compromised
        // kept admin access for up to 24h after the password change.
        return prisma.user.update({
            where: {id},
            data: {passwordHash: hashedPassword, tokenVersion: {increment: 1}},
            select: this.selectWithoutPass,
        });
    }

    async delete(id: number) {
        return prisma.user.delete({where: {id}});
    }
}

export default new UserService();
