import listNoteRepo from '../repositories/listNoteRepo.js';

export default {
    async create(data) {
        let retVal = listNoteRepo.create(data);
        return retVal;
    },

    async getAllForList(listId) {
        return listNoteRepo.getAllForList(listId);
    },

    async getById(id) {
        const list = await listNoteRepo.getById(id);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updateData) {
        const list = await listNoteRepo.update(id, updateData);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async remove(id) {
        const result = await listNoteRepo.remove(id);
        if (result) {
            return;
        } else {
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
