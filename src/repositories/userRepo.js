import prisma from '../config/db.js';

export default {

    async create(data) {
        try {
            const newUser = await prisma.user.create({
                data,
                omit: { password: true },
            });
            return newUser;
        } catch (error) {
            if (error.code === 'P2002') {
                const err = new Error('Email has already been used');
                err.status = 409;
                throw err;
            } else {
                throw error;
            }
        }
    },

    async findByEmailInternal(email) {
        return prisma.user.findUnique({ where: { email: email } });
    },

    async findAll() {
        return prisma.user.findMany({ omit: { password: true } });
    },

    async findById(id) {
        return prisma.user.findUnique({
            where: { id: id },
            omit: { password: true },
        });
    },

    async update(id, updatedData) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updatedData,
                omit: { password: true },
            });
            return updatedUser;
        } catch (error) {
            if (error.code === 'P2025') return null;
            if (error.code === 'P2002') {
                const err = new Error('Email has already been used');
                err.status = 409;
                throw err;
            }
            throw error;
        }
    },

    async patch(id, patchedData) {
        try {
            const patchedUser = await prisma.user.update({
                where: { id },
                data: patchedData,
                omit: { password: true },
            });
            return patchedUser;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    },

    async remove(id) {
        try {
            const deletedUser = await prisma.user.delete({
                where: { id },
                omit: { password: true },
            });
            return deletedUser;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    }
};