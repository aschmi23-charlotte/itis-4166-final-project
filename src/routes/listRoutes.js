import express from 'express';
import paramValidator from '../middleware/paramValidator.js';
import listValidator from '../middleware/listValidator.js';
import listController from '../controllers/listController.js';
import listItemController from '../controllers/listItemController.js';
import listNoteController from '../controllers/listNoteController.js';
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

router.get(
    '/all',
    permissionHandler.authenticate,
    permissionHandler.authorizeAccess(
        rules.loggedInUserIsRole("ADMIN")
    ),
    listController.getAll
);

router.get(
    '/public',
    permissionHandler.authenticateOptional,
    listController.getAllPublic
);

router.get(
    '/:list_id',
    permissionHandler.authenticateOptional,
    paramValidator.validateListId,
    paramValidator.loadAssociatedList,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.associatedListIsPublic(),
            rules.loggedInUserIsRole("ADMIN"),
            rules.loggedInUserOwnsAssociatedList(),
        )
    ),
    listController.getById,
);

router.put(
    '/:list_id',
    permissionHandler.authenticate,
    paramValidator.validateListId,
    paramValidator.loadAssociatedList,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listValidator.validateUpdate,
    listController.update,
);
router.delete(
    '/:list_id',
    permissionHandler.authenticate,
    paramValidator.validateListId,
    paramValidator.loadAssociatedList,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listController.delete,
);

router.get(
    '/:list_id/items',
    permissionHandler.authenticateOptional,
    paramValidator.validateListId,
    paramValidator.loadAssociatedList,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.associatedListIsPublic(),
            rules.loggedInUserIsRole("ADMIN"),
            rules.loggedInUserOwnsAssociatedList()
        )
    ),
    listItemController.getAllForList,
);

router.get(
    '/:list_id/notes',
    permissionHandler.authenticateOptional,
    paramValidator.validateListId,
    paramValidator.loadAssociatedList,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.associatedListIsPublic(),
            rules.loggedInUserIsRole("ADMIN"),
            rules.loggedInUserOwnsAssociatedList()
        )
    ),
    listNoteController.getAllForList,
);

export default router;
