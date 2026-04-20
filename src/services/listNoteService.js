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
            // I don't think this code is reachable anymore. We need to check the `isPublic` permission on the
            // associated list, which means looking up both the list and item in middleware.
            // Ergo, a 404 error will be thrown before this function is even run.
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
            // I don't think this code is reachable anymore. We need to check the `isPublic` permission on the
            // associated list, which means looking up both the list and item in middleware.
            // Ergo, a 404 error will be thrown before this function is even run.
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
