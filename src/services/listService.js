import listRepo from '../repositories/listRepo.js';

export default {
    async create(data) {
        return listRepo.create(data);
    },

    async getAll() {
        return listRepo.getAll();
    },

    async getAllForUser(ownerId) {
        return listRepo.getAllForUser(ownerId);
    },

    async getById(id) {
        const list = await listRepo.getById(id);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updateData) {
        const list = await listRepo.update(id, updateData);
        console.log(list);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async remove(id) {
        const result = await listRepo.remove(id);
        if (result) {
            return;
        } else {
            const error = new Error(`To-Do List ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
