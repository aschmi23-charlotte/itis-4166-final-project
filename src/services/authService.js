import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepo from '../repositories/userRepo.js';

export default {
    async signUp(email, password, role) {
        const hashedPassword = await bcrypt.hash(
            password,
            await bcrypt.genSalt(),
        );
        const newUser = await userRepo.create({
            email,
            password: hashedPassword,
            role,
        });
        return newUser;
    },

    async login(email, password) {
        const err = new Error('Invalid Credentials');
        err.status = 401;

        const user = await userRepo.findByEmailInternal(email);
        if (!user) {
            throw err;
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw err;
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN },
        );

        return accessToken;
    },
};
