import authService from '../services/authService.js';

export default {
    async signUp(req, res) {
        const { email, password, role } = req.body;

        const newUser = await authService.signUp(email, password, role);
        res.status(201).json(newUser);
    },

    async login(req, res) {
        const { email, password } = req.body;
        const accessToken = await authService.login(email, password);
        res.status(200).json({ accessToken });
    },
};
