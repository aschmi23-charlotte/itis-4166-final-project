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

        loggedInUserOwnsNewList() {
            return async function (req) {
                /// ownerId will be defaulted to the logged in user is not present.
                return (
                    req.body.ownerId === undefined ||
                    req.user.id === req.body.ownerId
                );
            };
        },

        loggedInUserOwnsAssociatedList() {
            return async function (req) {
                if (req.associatedList) {
                    return req.associatedList.ownerId === req.user.id;
                }

                // We only reach this point if we forgot to call a middleware that loads an associated list.
                let err = new Error('req.associatedList was not loaded');
                err.status = 500;
                throw err;
            };
        },

        loggedInUserOwnsListFromReqBody() {
            return async function (req) {
                if (req.body.listId) {
                    // List id specified in the JSON body.
                    let list = await listService.getById(req.body.listId);
                    return list.ownerId === req.user.id;
                }

                // We should only reach this point if the request body wasn't validated.
                let err = new Error(
                    'req.body was not properly validated: req.body.listId is missing.',
                );
                err.status = 500;
                throw err;
            };
        },
    },
};
