import { param, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';
import listService from '../services/listService.js';
import listItemService from '../services/listItemService.js';
import listNoteService from '../services/listNoteService.js';

export default {
    validateUserId: [
        oneOf(
            [
                param('user_id').isInt().bail(),
                param('user_id').isString().equals('me').bail(),
            ],
            {
                message:
                    "URL parameter 'user_id' must be an integer, or the string 'me'",
            },
        ),
        handleValidationErrors,
    ],

    async handleUserIdIsMe(req, res, next) {
        let user_id_str = req.params.user_id;
        if (user_id_str === 'me') {
            req.param_user_id = req.user.id;
        } else {
            req.param_user_id = parseInt(user_id_str);
        }

        next();
    },

    validateListId: [
        param('list_id')
            .isInt()
            .withMessage("URL parameter 'list_id' must be an integer")
            .bail(),

        handleValidationErrors,
    ],

    validateItemId: [
        param('item_id')
            .isInt()
            .withMessage("URL parameter 'item_id' must be an integer")
            .bail(),

        handleValidationErrors,
    ],    

    validateNoteId: [
        param('note_id')
            .isInt()
            .withMessage("URL parameter 'note_id' must be an integer")
            .bail(),

        handleValidationErrors,
    ],

    async loadAssociatedList(req, res, next) {
        if (req.params.list_id) {
            // List param specified in URL
            let list_id = parseInt(req.params.list_id);
            let list = await listService.getById(list_id);
            req.associatedList = list;
            return next();
        }

        // Only runs if we call this on a URL without the list_id param.
        let err = new Error ("This URL is not allociated with any list");
        err.status = 500;
        throw err;
    },
    
    async loadAssociatedListItem (req, res, next) {
        if (req.params.item_id) {
            // List ID param specified in URL
            let item_id = parseInt(req.params.item_id);
            let item = await listItemService.getById(item_id);
            let list = await listService.getById(item.listId);
            req.associatedList = list;
            req.associatedListItem = item;
            return next();
        } 
        
        // Only runs if we call this on a URL without the item_id param.
        let err = new Error ("This URL is not allociated with any list or listitem");
        err.status = 500;
        throw err;
    },

    async loadAssociatedListNote (req, res, next) {
        if (req.params.item_id) {
            // List ID param specified in URL
            let note_id = parseInt(req.params.note_id);
            let note = await listNoteService.getById(note_id);
            let list = await listService.getById(note.listId);
            req.associatedList = list;
            req.associatedListItem = note;
            return next();
        } 
        
        // Only runs if we call this on a URL without the item_id param.
        let err = new Error ("This URL is not allociated with any list or listnote");
        err.status = 500;
        throw err;
    }
};

// Store the id for the user specified in the request object
