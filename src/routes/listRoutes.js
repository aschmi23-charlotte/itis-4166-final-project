import express from 'express';
import paramValidator from '../middleware/paramValidator.js';
import toDoListValidator from '../middleware/toDoListValidator.js';
import listController from '../controllers/listController.js';
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
    listController.create,
);

router.get('/', permissionHandler.authenticateOptional, listController.getAll);
router.get('/:list_id', permissionHandler.authenticateOptional, listController.getById);

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
    listController.update,
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
    listController.delete,
);

export default router;
