import express from 'express';
const router = express.Router();
import { signUpHandler, loginHandler } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateSignup, validateLogin } from '../middleware/userValidators.js';

router.post('/signup', validateSignup, signUpHandler);
router.post('/login', loginLimiter, validateLogin, loginHandler);
export default router;
