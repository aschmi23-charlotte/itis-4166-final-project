import prisma from '../config/db.js';
import userRepo from './userRepo.js';

export default {
    async create(data) {
        try {
            const list = prisma.toDoListItem.create({ data: data });
            return list;

        } catch (error) {
            if (error.code === 'P2003') {
                const newError = new Error(
                    `Cannot create listitem: referenced list with id ${data.listId} does not exist`,
                );
                newError.status = 400;
                throw newError;
            } else {
                throw error;
            }
        }
    },

    async getAllForList(ownerId) {
        const list = await prisma.toDoListItem.findMany({ where: { ownerId } });
        return list;
    },

    async getById(id) {
        const list = await prisma.toDoListItem.findUnique({ where: { id } });
        return list;
    },

    async update(id, updateData) {
        try {
            const list = await prisma.toDoListItem.update({
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
            const list = await prisma.toDoListItem.delete({
                where: { id },
            });
            return list;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    },
};