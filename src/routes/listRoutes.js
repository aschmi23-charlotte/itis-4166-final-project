import express from 'express';
import paramValidator from '../middleware/paramValidator.js';
import listValidator from '../middleware/listValidator.js';
import listController from '../controllers/listController.js';
import permissionHandler from '../middleware/permissionHandler.js';

const rules = permissionHandler.accessRules;

const router = express.Router();
router.post(
    '/',
    permissionHandler.authenticate,
    listValidator.validateCreate,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsNewList(),
        ),
    ),
    listController.create,
);

router.get('/', permissionHandler.authenticateOptional, listController.getAll);
router.get('/:list_id', permissionHandler.authenticateOptional, paramValidator.validateListId, listController.getById);

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
    listValidator.validateUpdate,
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
