import express from 'express';
import listItemController from '../controllers/listItemController.js';

import paramValidator from '../middleware/paramValidator.js';
import toDoListValidator from '../middleware/toDoListValidator.js';
import permissionHandler from '../middleware/permissionHandler.js';

const rules = permissionHandler.accessRules;

const router = express.Router();
router.post(
    '/',
    permissionHandler.authenticate,
    toDoListValidator.validateCreate,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsNewList(),
        ),
    ),
    listItemController.create,
);

router.get('/', permissionHandler.authenticateOptional, listItemController.getAll);
router.get('/:list_id', permissionHandler.authenticateOptional, listItemController.getById);

router.put(
    '/:list_id',
    permissionHandler.authenticate,
    paramValidator.validateListId,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsList(),
        ),
    ),
    toDoListValidator.validateUpdate,
    listItemController.update,
);
router.delete(
    '/:list_id',
    permissionHandler.authenticate,
    paramValidator.validateListId,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsList(),
        ),
    ),
    listItemController.delete,
);

export default router;
