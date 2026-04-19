import listItemRepo from '../repositories/listItemRepo.js';

export default {
    async create(data) {
        let retVal = listItemRepo.create(data);
        console.log("why");
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
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updateData) {
        const list = await listItemRepo.update(id, updateData);
        if (list) {
            return list;
        } else {
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async remove(id) {
        const result = await listItemRepo.remove(id);
        if (result) {
            return;
        } else {
            const error = new Error(`To-Do List Item ${id} not found`);
            error.status = 404;
            throw error;
        }
    },
};
