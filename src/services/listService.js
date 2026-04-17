import listRepo from '../repositories/listRepo.js';

export default {
    async create(title, isPublic, ownerId) {
        return listRepo.create({
            title,
            isPublic,
            ownerId,
        });
    },

    async getAll() {
        return listRepo.getAll();
    },

    async getById(id) {
        const list = listRepo.getById(id);
        if (list) {
            return list;
        } else {
            const error = new Error(`ToDoList ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updateData) {
        const list = listRepo.update(id, updateData);
        if (list) {
            return list;
        } else {
            const error = new Error(`ToDoList ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async remove(id) {
        const result = listRepo.remove(id);
        if (result) {
            return;
        } else {
            const error = new Error(`ToDoList ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
