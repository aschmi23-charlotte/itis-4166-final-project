// import { getPostById } from "../services/postService.js";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

import listService from '../services/listService.js';

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

    // An access rule is a function that accepts the request object and returns boolean.
    authorizeAccess(rule) {
        return function (req, res, next) {
            // Making the error handling a function here for convenience.
            let approved = rule(req);

            if (!approved) {
                const err = new Error('Forbidden: insufficient permission');
                err.status = 403;
                return next(err);
            }
            return next();
        };
    },
    // Function factories for rules
    accessRules: {
        // Checking multiple rules:
        AND(...rules) {
            return function (req) {
                let approved = true;

                rules.forEach((rule) => {
                    approved &&= rule(req);
                });

                return approved;
            };
        },

        OR(...rules) {
            return function (req) {
                let approved = false;

                rules.forEach((rule) => {
                    approved ||= rule(req);
                });

                return approved;
            };
        },

        loggedInUserIsRole(...roles) {
            return function (req) {
                return roles.includes(req.user.role);
            };
        },

        loggedInUserIsUserId() {
            return function (req) {
                return req.user.id === req.param_user_id;
            };
        },

        loggedInUserOwnsNewList() {
            return function (req) {
                /// ownerId will be defaulted to the logged in user is not present.
                return (
                    req.body.ownerId === undefined ||
                    req.user.id === req.body.ownerId
                );
            };
        },

        loggedInUserOwnsList() {
            return function (req) {
                let list_id = parseInt(req.params.list_id);
                let list = listService.getById(list_id);
                return list.ownerId === req.user.id;
            };
        },
    },
};
