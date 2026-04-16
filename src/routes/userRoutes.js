import express from 'express';
import {
    getAllUsersHandler,
    getUserHandler,
    updateUserHandler,
    patchUserHandler,
    deleteUserHandler,
} from '../controllers/userController.js';

import { authenticate } from '../middleware/authenticate.js';
import { validateUserIdParam, handleUserParamIsMe } from '../middleware/validateUserIdParam.js'
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeUserAccessRules } from '../middleware/authorizeUser.js';
const router = express.Router();

router.get('/', authenticate, authorizeUserAccessRules("role:ADMIN"), getAllUsersHandler);
router.get('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), getUserHandler);
router.put('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), validateUpdateUser, updateUserHandler);
router.patch('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN"), patchUserHandler);
router.delete('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), deleteUserHandler);

export default router;
