import express from 'express';
import listNoteController from '../controllers/listNoteController.js';

import paramValidator from '../middleware/paramValidator.js';
import listNoteValidator from '../middleware/listNoteValidator.js';
import permissionHandler from '../middleware/permissionHandler.js';

const rules = permissionHandler.accessRules;

const router = express.Router();
router.post(
    '/',
    permissionHandler.authenticate,
    listNoteValidator.validateCreate,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsListFromReqBody(),
        ),
    ),
    listNoteController.create,
);

router.get('/:note_id', permissionHandler.authenticateOptional, paramValidator.validateNoteId, paramValidator.loadAssociatedListNote, listNoteController.getById);

router.put(
    '/:note_id',
    permissionHandler.authenticate,
    paramValidator.validateNoteId,
    paramValidator.loadAssociatedListNote,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listNoteValidator.validateUpdate,
    listNoteController.update,
);

router.delete(
    '/:note_id',
    permissionHandler.authenticate,
    paramValidator.validateNoteId,
    paramValidator.loadAssociatedListNote,
    permissionHandler.authorizeAccess(
        rules.OR(
            rules.loggedInUserIsRole('ADMIN'),
            rules.loggedInUserOwnsAssociatedList(),
        ),
    ),
    listNoteController.delete,
);

export default router;
