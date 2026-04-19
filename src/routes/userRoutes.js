import express from 'express';
import userController from '../controllers/userController.js';

import permissionHandler from '../middleware/permissionHandler.js';
import userValidator from '../middleware/userValidator.js';
import paramValidator from '../middleware/paramValidator.js';

const router = express.Router();

const rules = permissionHandler.accessRules;

router.get(
    '/',
    permissionHandler.authenticate,
    permissionHandler.authorizeAccess(rules.loggedInUserIsRole("ADMIN")),
    userController.getAll,
);
router.get(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.handleUserIdIsMe,
    permissionHandler.authorizeAccess(rules.OR(rules.loggedInUserIsRole("ADMIN"), rules.loggedInUserIsUserId())),
    userController.getById,
);
router.put(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.handleUserIdIsMe,
    permissionHandler.authorizeAccess(rules.OR(rules.loggedInUserIsRole("ADMIN"), rules.loggedInUserIsUserId())),
    userValidator.validateUpdate,
    userController.update,
);
router.patch(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.handleUserIdIsMe,
    permissionHandler.authorizeAccess(rules.loggedInUserIsRole("ADMIN")),
    userValidator.validatePatch,
    userController.patch,
);
router.delete(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.handleUserIdIsMe,
    permissionHandler.authorizeAccess(rules.OR(rules.loggedInUserIsRole("ADMIN"), rules.loggedInUserIsUserId())),
    userController.remove,
);

export default router;
