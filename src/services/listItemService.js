import listItemRepo from '../repositories/listItemRepo.js';

export default {
    async create(data) {
        let retVal = listItemRepo.create(data);
        return retVal;
    },

    async getAllForList(listId) {
        return listItemRepo.getAllForList(listId);
    },

    async getById(id) {
        const list = await listItemRepo.getById(id);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List Note ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updateData) {
        const list = await listItemRepo.update(id, updateData);
        if (list) {
            return list;
        } else {
            // I don't think this code is reachable anymore. We need to check the `isPublic` permission on the
            // associated list, which means looking up both the list and item in middleware.
            // Ergo, a 404 error will be thrown before this function is even run.
            const error = new Error(`To-Do List Note ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async remove(id) {
        const result = await listItemRepo.remove(id);
        if (result) {
            return;
        } else {
            // I don't think this code is reachable anymore. We need to check the `isPublic` permission on the
            // associated list, which means looking up both the list and item in middleware.
            // Ergo, a 404 error will be thrown before this function is even run.
            const error = new Error(`To-Do List Note ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
