import bcrypt from 'bcrypt';
import userRepo from '../repositories/userRepo.js';

export default {
    async getAllUsers() {
        return userRepo.findAll();
    },

    async getById(id) {
        const user = await userRepo.findById(id);
        if (user) return user;
        else {
            const error = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async update(id, updatedData) {
        if (updatedData.password) {
            let plain_pwd = updatedData.password;
            updatedData.password = await bcrypt.hash(
                plain_pwd,
                await bcrypt.genSalt(),
            );
        }

        const updatedUser = await userRepo.update(id, updatedData);
        if (updatedUser) return updatedUser;
        else {
            const error = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }
    },

    async patch(id, patchedData) {
        const patchedUser = await userRepo.patch(id, patchedData);
        if (patchedUser) return patchedUser;
        else {
            const error = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }
    },


    async remove(id) {
        const result = await userRepo.remove(id);
        if (result) return;
        else {
            const error = new Error(`User ${id} not found`);
            error.status = 404;
            throw error;
        }
    }
};