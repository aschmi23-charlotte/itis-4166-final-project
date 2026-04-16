import express from 'express';
import userController from '../controllers/userController.js';

import { authenticate } from '../middleware/authenticate.js';
import { validateUserIdParam, handleUserParamIsMe } from '../middleware/validateUserIdParam.js'
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeUserAccessRules } from '../middleware/authorizeUser.js';
const router = express.Router();

router.get('/', authenticate, authorizeUserAccessRules("role:ADMIN"), userController.getAll);
router.get('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), userController.getById);
router.put('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), validateUpdateUser, userController.update);
router.patch('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN"), userController.patch);
router.delete('/:user_id', authenticate, validateUserIdParam, handleUserParamIsMe, authorizeUserAccessRules("role:ADMIN", "user:me"), userController.remove);

export default router;
