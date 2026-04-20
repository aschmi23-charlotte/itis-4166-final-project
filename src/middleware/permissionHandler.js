// import { getPostById } from "../services/postService.js";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

import listService from '../services/listService.js';
import listItemService from '../services/listItemService.js';
import listNoteService from '../services/listNoteService.js';

// Shorthand for access failure.
function throw_invalid_access_rule(str, explanation) {
    const err = new Error(
        `Internal Server Error: Invalid access rule ${str} - ${explanation}`,
    );
    err.status = 500;
    return next(err);
}

export default {
    authenticate(req, res, next) {
        const err = new Error('Not authenticated. Please provide valid token.');
        err.status = 401;

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(err);
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, JWT_SECRET);
            req.user = { id: payload.id, role: payload.role };
            next();
        } catch (error) {
            return next(err);
        }
    },

    authenticateOptional(req, res, next) {
        req.user = { id: null, role: null };

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        
        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, JWT_SECRET);
            req.user = { id: payload.id, role: payload.role };
            return next();
        } catch (error) {
            return next(error);
        }
    },

    // An access rule is a async function that accepts the request object and returns boolean.
    authorizeAccess(rule) {
        return async function (req, res, next) {
            // Making the error handling a function here for convenience.
            try {
                let approved = await rule(req);
                if (!approved) {
                    const err = new Error('Forbidden: insufficient permission');
                    err.status = 403;
                    return next(err);
                }
                return next();
            } catch (error) {
                next(error);
            }
        };
    },
    // Function factories for rules
    accessRules: {
        // Checking multiple rules:
        AND(...rules) {
            return async function (req) {
                let approved = true;

                for (let i = 0; i < rules.length; i++) {
                    approved &&= await rules[i](req);
                }

                return approved;
            };
        },

        OR(...rules) {
            return async function (req) {
                let approved = false;

                for (let i = 0; i < rules.length; i++) {
                    approved ||= await rules[i](req);
                }

                return approved;
            };
        },

        loggedInUserIsRole(...roles) {
            return async function (req) {
                return roles.includes(req.user.role);
            };
        },

        loggedInUserIsUserId() {
            return async function (req) {
                return req.user.id === req.param_user_id;
            };
        },

        // Needs to be seperate since owner ID could possibly be undefined.
        loggedInUserOwnsNewList() {
            return async function (req) {
                /// ownerId will be defaulted to the logged in user is not present.
                return (
                    req.body.ownerId === undefined ||
                    req.user.id === req.body.ownerId
                );
            };
        },

        loggedInUserOwnsList() {
            return async function (req) {
                if (req.params.list_id) {
                    // List param specified in URL
                    let list_id = parseInt(req.params.list_id);
                    let list = await listService.getById(list_id);
                    return list.ownerId === req.user.id;

                } else if (req.params.item_id) {
                    // List ID param specified in URL
                    let item_id = parseInt(req.params.item_id);
                    let item = await listItemService.getById(item_id);
                    let list = await listService.getById(item.listId);
                    return list.ownerId === req.user.id;
                
                } else if (req.params.note_id) {
                    // List ID param specified in URL
                    let note_id = parseInt(req.params.note_id);
                    let note = await listNoteService.getById(note_id);
                    let list = await listService.getById(note.listId);
                    return list.ownerId === req.user.id;
                
                } else if (req.body.listId) {
                    // List id specified in the JSON body.
                    let list = await listService.getById(req.body.listId);
                    return list.ownerId === req.user.id;
                }
                 
                let err = new Error ("This URL is not allociated with any list");
                err.status = 500;
                throw err;
            };
        },
    },
};
