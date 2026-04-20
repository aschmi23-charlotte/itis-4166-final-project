import express from 'express';
import userController from '../controllers/userController.js';
import listController from '../controllers/listController.js';

import permissionHandler from '../middleware/permissionHandler.js';
import userValidator from '../middleware/userValidator.js';
import paramValidator from '../middleware/paramValidator.js';

const router = express.Router();

const rules = permissionHandler.accessRules;

router.get(
    '/',
    permissionHandler.authenticate,
    permissionHandler.authorizeAccess(rules.loggedInUserIsRole('ADMIN')),
    userController.getAll,
);
router.get(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.associatedUserIsLoggedIn(),
        ),
    ),
    userController.getById,
);

router.get(
    '/:user_id/lists',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.associatedUserIsLoggedIn(),
        ),
    ),
    listController.getAllForUser
);

router.put(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.associatedUserIsLoggedIn(),
        ),
    ),
    userValidator.validateUpdate,
    userController.update,
);
router.patch(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(rules.loggedInUserIsRole('ADMIN')),
    userValidator.validatePatch,
    userController.patch,
);
router.delete(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.associatedUserIsLoggedIn(),
        ),
    ),
    userController.remove,
);

export default router;
