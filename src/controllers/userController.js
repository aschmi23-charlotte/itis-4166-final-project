import userService from '../services/userService.js';

export default {
    async getAll(req, res) {
        const users = await userService.getAll();
        res.status(200).json(users);
    },

    async getById(req, res) {
        const id = parseInt(req.param_user_id);
        const post = await userService.getById(id);
        res.status(200).json(post);
    },

    async update(req, res) {
        const id = parseInt(req.param_user_id);
        const { email, password } = req.body;
        const updatedUser = await userService.update(id, { email, password });
        res.status(200).json(updatedUser);
    },

    async patch(req, res) {
        const id = parseInt(req.param_user_id);
        const { role } = req.body;
        const patchedUser = await userService.patch(id, { role });
        res.status(200).json(patchedUser);
    },

    async remove(req, res) {
        const id = parseInt(req.param_user_id);
        await userService.remove(id);
        res.status(204).send();
    },
};
