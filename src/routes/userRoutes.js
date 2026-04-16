import express from 'express';
import {
    getAllUsersHandler,
    getLoggedInUserHandler,
    updateLoggedInUserHandler,
    deleteLoggedInUserHandler,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateUserIdParam, handleUserParamIsMe } from '../middleware/validateUserIdParam.js'
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
const router = express.Router();

router.get('/', authenticate, authorizeRoles('ADMIN'), getAllUsersHandler);
router.get('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, getLoggedInUserHandler);
router.put('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, validateUpdateUser, updateLoggedInUserHandler);
router.delete('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, deleteLoggedInUserHandler);
// router.get('/me/posts', authenticate, getPostsForLoggedInUserHandler);
router.get('/:user_id/patch', authenticate, validateUserIdParam, handleUserParamIsMe, (req, res) => {
    console.log('poop');
});

export default router;
