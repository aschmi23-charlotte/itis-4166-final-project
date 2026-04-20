import prisma from '../config/db.js';
import userRepo from './userRepo.js';

export default {
    async create(data) {
        try {
            const list = await prisma.toDoListItem.create({ data: data });
            return list;
        } catch (error) {
            if (error.code === 'P2003') {
                const newError = new Error(
                    `Cannot create To-Do List Item: referenced list with id ${data.listId} does not exist`,
                );
                newError.status = 400;
                console.log(newError);
                throw newError;
            } else {
                console.log('WTF');
                throw error;
            }
        }
    },

    async getAllForList(listId) {
        const list = await prisma.toDoListItem.findMany({ where: { listId } });
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
