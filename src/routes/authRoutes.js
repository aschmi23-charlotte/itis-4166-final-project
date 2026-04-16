import express from 'express';
const router = express.Router();
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateSignup, validateLogin } from '../middleware/userValidators.js';
import authController from '../controllers/authController.js';

router.post('/signup', validateSignup, authController.signUp);
router.post('/login', loginLimiter, validateLogin, authController.login);
export default router;
