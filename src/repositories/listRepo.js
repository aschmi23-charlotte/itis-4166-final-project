import prisma from '../config/db.js';
import userRepo from './userRepo.js';

export default {
    async create(data) {
        try {
            const list = await prisma.toDoList.create({ data: data });
            return list;

        } catch (error) {
            if (error.code === 'P2003') {
                const newError = new Error(
                    `Cannot create list: user with id ${data.userid} does not exist`,
                );
                newError.status = 400;
                throw newError;
            } else {
                throw error;
            }
        }
    },

    async getAll() {
        const lists = await prisma.toDoList.findMany();
        return lists;
    },

    async getAllForUser(ownerId) {
        const list = await prisma.toDoList.findMany({ where: { ownerId } });
        return list;
    },

    async getById(id) {
        const list = await prisma.toDoList.findUnique({ where: { id } });
        return list;
    },

    async update(id, updateData) {
        try {
            const list = await prisma.toDoList.update({
                where: { id },
                data: updateData,
            });
            return list;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    },

    async remove(id) {
        try {
            const list = await prisma.toDoList.delete({
                where: { id },
            });
            return list;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    },
};
