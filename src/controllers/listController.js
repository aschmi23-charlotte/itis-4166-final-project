import listService from '../services/listService.js';

export default {
    async create(req, res) {
        const {
            title = '',
            isPublic = false,
            ownerId = req.user.id, // Defaults to logged in user.
        } = req.body;
        const newList = await listService.create({
            title,
            isPublic,
            ownerId,
        });
        res.status(201).json(newList);
    },

    async getAll(req, res) {
        let lists = await listService.getAll();
        res.status(200).json(lists);
    },

    async getAllForUser(req, res) {
        let lists = await listService.getAllForUser(req.associatedUser.id);
        res.status(200).json(lists);
    },

    async getAllPublicForUser(req, res) {
        let lists = await listService.getAllPublicForUser(req.associatedUser.id);
        res.status(200).json(lists);
    },

    async getById(req, res) {
        const id = parseInt(req.params.list_id);
        const list = await listService.getById(id);
        res.status(200).json(list);
    },

    async update(req, res) {
        const id = parseInt(req.params.list_id);
        const { title = undefined, isPublic = undefined } = req.body;
        const updatedList = await listService.update(id, {
            title,
            isPublic,
        });
        res.status(200).json(updatedList);
    },

    async delete(req, res) {
        const id = parseInt(req.params.list_id);
        await listService.remove(id);
        res.status(204).send();
    },
};
