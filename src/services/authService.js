import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { create, findByEmailInternal } from '../repositories/userRepo.js';

const SIGNUP_AS_ADMIN = true;

export async function signUp(email, password, role) {

    if (!SIGNUP_AS_ADMIN && role === 'ADMIN') {
        let err = new Error("Signing up with ADMIN role is currently disabled");
        err.code = 400;
        throw err;
    }
    
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    const newUser = await create({ email, password: hashedPassword, role });
    return newUser;
}

export async function login(email, password) {
    const err = new Error('Invalid Credentials');
    err.status = 401;

    const user = await findByEmailInternal(email);
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
}
