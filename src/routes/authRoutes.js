import express from 'express';
const router = express.Router();
import userValidator from '../middleware/userValidator.js';
import authController from '../controllers/authController.js';

router.post('/signup', userValidator.validateSignup, authController.signUp);
router.post(
    '/login',
    userValidator.loginLimiter,
    userValidator.validateLogin,
    authController.login,
);
export default router;
