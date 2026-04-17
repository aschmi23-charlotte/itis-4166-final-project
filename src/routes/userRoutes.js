import express from 'express';
import userController from '../controllers/userController.js';

import permissionHandler from '../middleware/permissionHandler.js';
import userValidator from '../middleware/userValidator.js';
import paramValidator from '../middleware/paramValidator.js';

const router = express.Router();

router.get('/', permissionHandler.authenticate, permissionHandler.authorizeAccessRules("role:ADMIN"), userController.getAll);
router.get('/:user_id', permissionHandler.authenticate, paramValidator.validateUserId, paramValidator.handleUserIdIsMe, permissionHandler.authorizeAccessRules("role:ADMIN", "user:me"), userController.getById);
router.put('/:user_id', permissionHandler.authenticate, paramValidator.validateUserId, paramValidator.handleUserIdIsMe, permissionHandler.authorizeAccessRules("role:ADMIN", "user:me"), userValidator.validateUpdate, userController.update);
router.patch('/:user_id', permissionHandler.authenticate, paramValidator.validateUserId, paramValidator.handleUserIdIsMe, permissionHandler.authorizeAccessRules("role:ADMIN"), userValidator.validatePatch, userController.patch);
router.delete('/:user_id', permissionHandler.authenticate, paramValidator.validateUserId, paramValidator.handleUserIdIsMe, permissionHandler.authorizeAccessRules("role:ADMIN", "user:me"), userController.remove);

export default router;
