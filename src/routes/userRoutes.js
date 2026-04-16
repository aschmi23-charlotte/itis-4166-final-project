import express from 'express';
import { getAllUsersHandler, getLoggedInUserHandler, updateLoggedInUserHandler, deleteLoggedInPostHandler, getPostsForLoggedInUserHandler } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateUpdateUser } from '../middleware/userValidators.js'
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
const router = express.Router();

router.get('/', authenticate, authorizeRoles("ADMIN"), getAllUsersHandler);
router.get('/me', authenticate, getLoggedInUserHandler);
router.put('/me', authenticate, validateUpdateUser, updateLoggedInUserHandler);
router.delete('/me', authenticate, deleteLoggedInPostHandler);
router.get('/me/posts', authenticate, getPostsForLoggedInUserHandler);
router.get('/me/:id/patch', authenticate, (req, res)=>{console.log('poop')});

export default router;