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

    async getById(req, res) {
        const id = parseInt(req.params.item_id);
        const list = await listItemService.getById(id);
        res.status(200).json(list);
    },

    async update(req, res) {
        const id = parseInt(req.params.item_id);
        const { 
            title = undefined,
            isPublic = undefined
         } = req.body;
        const updatedItem = await listItemService.update(id, {
            title,
            isPublic,
        });
        res.status(200).json(updatedItem);
    },

    async delete(req, res) {
        const id = parseInt(req.params.item_id);
        await listService.remove(id);
        res.status(204).send();
    },
};
