import prisma from '../config/db.js';
import userRepo from './userRepo.js';

export default {
    async create(data) {
        try {
            const list = await prisma.toDoListNote.create({ data: data });
            return list;
        } catch (error) {
            if (error.code === 'P2003') {
                const newError = new Error(
                    `Cannot create To-Do List Note: referenced list with id ${data.listId} does not exist`,
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
        const list = await prisma.toDoListNote.findMany({ where: { listId } });
        return list;
    },

    async getById(id) {
        const list = await prisma.toDoListNote.findUnique({ where: { id } });
        return list;
    },

    async update(id, updateData) {
        try {
            const list = await prisma.toDoListNote.update({
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
            const list = await prisma.toDoListNote.delete({
                where: { id },
            });
            return list;
        } catch (error) {
            if (error.code === 'P2025') return null;
            throw error;
        }
    },
};
