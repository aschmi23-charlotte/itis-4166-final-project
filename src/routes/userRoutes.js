import express from 'express';
import {
    getAllUsersHandler,
    getLoggedInUserHandler,
    updateLoggedInUserHandler,
    patchLoggedInUserHandler,
    deleteLoggedInUserHandler,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateUserIdParam, handleUserParamIsMe } from '../middleware/validateUserIdParam.js'
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeUserAccessRules } from '../middleware/authorizeUser.js';
const router = express.Router();

router.get('/', authenticate, authorizeUserAccessRules("role:ADMIN"), getAllUsersHandler);
router.get('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), getLoggedInUserHandler);
router.put('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), validateUpdateUser, updateLoggedInUserHandler);
router.patch('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN"), patchLoggedInUserHandler);
router.delete('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), deleteLoggedInUserHandler);

export default router;
