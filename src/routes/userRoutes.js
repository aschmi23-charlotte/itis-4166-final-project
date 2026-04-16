import express from 'express';
import {
    getAllUsersHandler,
    getLoggedInUserHandler,
    updateLoggedInUserHandler,
    deleteLoggedInUserHandler,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
const router = express.Router();

router.get('/', authenticate, authorizeRoles('ADMIN'), getAllUsersHandler);
router.get('/:user_id', authenticate, getLoggedInUserHandler);
router.put(
    '/:user_id',
    authenticate,
    validateUpdateUser,
    updateLoggedInUserHandler,
);
router.delete('/:user_id', authenticate, deleteLoggedInUserHandler);
// router.get('/me/posts', authenticate, getPostsForLoggedInUserHandler);
router.get('/:user_id/patch', authenticate, (req, res) => {
    console.log('poop');
});

export default router;
