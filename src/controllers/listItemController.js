import listItemService from '../services/listItemService.js';

export default {
    async create(req, res) {
        const {
            name = '',
            details = null,
            listId = null, 
        } = req.body;
        const newItem = await listItemService.create({
            name,
            details,
            listId,
        });
        res.status(201).json(newItem);
    },

    async getAllForList(req, res) {
        const id = parseInt(req.params.list_id);
        const items = await listItemService.getAllForList(id);
        res.status(200).json(items);
    },

    async getById(req, res) {
        const id = parseInt(req.params.item_id);
        const item = await listItemService.getById(id);
        res.status(200).json(item);
    },

    async update(req, res) {
        const id = parseInt(req.params.item_id);
        const { 
            name = undefined,
            details = undefined
         } = req.body;
        const updatedItem = await listItemService.update(id, {
            name,
            details,
        });
        res.status(200).json(updatedItem);
    },

    async delete(req, res) {
        const id = parseInt(req.params.item_id);
        await listItemService.remove(id);
        res.status(204).send();
    },
};
