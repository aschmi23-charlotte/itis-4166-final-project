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

router.put(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    userValidator.validateUpdate,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.associatedUserIsLoggedIn(),
        ),
    ),
    userController.update,
);
router.patch(
    '/:user_id',
    permissionHandler.authenticate,
    paramValidator.validateUserId,
    userValidator.validatePatch,
    paramValidator.loadAssociatedUser,
    permissionHandler.authorizeAccess(rules.loggedInUserIsRole('ADMIN')),
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

router.get(
    '/:user_id/lists_public',
    permissionHandler.authenticateOptional,
    paramValidator.validateUserId,
    paramValidator.loadAssociatedUser,
    listController.getAllPublicForUser
);


export default router;
