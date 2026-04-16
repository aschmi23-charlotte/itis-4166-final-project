import * as listService from '../services/listService.js';

export default controller = {
    async create(req, res) {
        const { title, content } = req.body;
        const newPost = await listService.create({ title, content, authorId: req.user.id });
        res.status(201).json(newPost);
    },

    async getAll(req, res) {
        let posts = await listService.getAll();
        res.status(200).json(posts);
    },

    async getById(req, res) {
        const id = parseInt(req.params.id);
        const post = await listService.getById(id);
        res.status(200).json(post);
    },

    async update(req, res) {
        const id = parseInt(req.params.id);
        const { title, content } = req.body;
        const updatedPost = await listService.update(id, { title, content });
        res.status(200).json(updatedPost);
    },

    async delete(req, res) {
        const id = parseInt(req.params.id);
        await listService.remove(id);
        res.status(204).send();
    }

};