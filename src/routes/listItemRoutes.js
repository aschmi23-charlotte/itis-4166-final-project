import express from 'express';
import listItemController from '../controllers/listItemController.js';

import paramValidator from '../middleware/paramValidator.js';
import listItemValidator from '../middleware/listItemValidator.js';
import permissionHandler from '../middleware/permissionHandler.js';

const rules = permissionHandler.accessRules;

const router = express.Router();
router.post(
    '/',
    permissionHandler.authenticate,
    listItemValidator.validateCreate,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsListFromReqBody(),
        ),
    ),
    listItemController.create,
);

router.get(
    '/:item_id',
    permissionHandler.authenticateOptional,
    paramValidator.validateItemId,
    paramValidator.loadAssociatedListItem,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.associatedListIsPublic(),
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listItemController.getById,
);

router.put(
    '/:item_id',
    permissionHandler.authenticate,
    paramValidator.validateItemId,
    paramValidator.loadAssociatedListItem,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listItemValidator.validateUpdate,
    listItemController.update,
);
router.delete(
    '/:item_id',
    permissionHandler.authenticate,
    paramValidator.validateItemId,
    paramValidator.loadAssociatedListItem,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listItemController.delete,
);

export default router;
