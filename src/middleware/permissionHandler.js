// import { getPostById } from "../services/postService.js";
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

// Shorthand for access failure.
function throw_invalid_access_rule(str, explanation) {
    const err = new Error(
        `Internal Server Error: Invalid access rule ${str} - ${explanation}`,
    );
    err.status = 500;
    return next(err);
}

// A more robust authorization mechanism using identifier strings.
// Valid strings are:
// * role:{role} - the logged in user has this role. Example: 'role:ADMIN'
// * user:{id} - the logged in user is a specific user. Example: 'user:6'
// * user:me - the logged in user is matches the `user_id` parameter (IE, the user is editing itself). Example: 'user:me'
function checkRuleString(req, res, rule) {
    if (!rule.includes(':')) {
        throw_invalid_access_rule(rule, "the ':' seperator is missing");
    }

    let str_args = rule.split(':');
    let str_type = str_args[0];
    let str_val = str_args[1];

    // Used on all routes
    switch (str_type) {
        case 'role':
            // This is an approved role:
            return req.user.role === str_val;
        case 'user':
            switch (str_val) {
                // The logged in user is the user from user_id
                case 'me':
                    return req.user.id === req.param_user_id;
                default:
                    // The logged in user is this specific user.
                    return req.user.id === parseInt(str_val);
            }
        case 'newlist':
            switch (str_val) {
                // The logged in user is the user from user_id
                case 'owner_is_user':
                    if (!req.body.ownerId) {
                        throw_invalid_access_rule(
                            rule,
                            `req.body.ownerId is not defined on this route`,
                        );
                    }
                    return req.user.id === req.body.ownerId;
                    break;
                default:
                    // The logged in user is this specific user.
                    throw_invalid_access_rule(
                        rule,
                        `invalid rule string ${str_val} for type '${str_type}'`,
                    );
            }
            break;
        default:
            throw_invalid_access_rule(
                rule,
                `invalid rule string type '${str_type}'`,
            );
    }

    // else {
    //     throw_invalid_access_rule(rule, `invalid rule type '${typeof rule}'`);
    // }
}

function checkRuleGroup(req, res, group) {
    let approved = undefined;
    /** type */
    /** @type {string} */ let mode = group.mode;
    /** @type {Array} */ let rules = group.rules;
    rules.forEach(
        /**
         * @param {string} rule
         */
        (rule) => {
            let check = false;
            if (typeof rule === 'string') {
                check = checkRuleString(req, res, rule);
            } else if (typeof rule === 'object') {
                check = checkRuleGroup(req, res, rule);
            }

            if (approved === undefined) {
                approved = check;
            } else if (mode === 'AND') {
                approved &&= check;
            } else if (mode === 'OR') {
                approved &&= check;
            } else {
                throw_invalid_access_rule(
                    group,
                    `group mode must be AND or OR`,
                );
            }
        },
    );

    return approved;
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

    authorizeAccessRules(...ruleStrings) {
        return function (req, res, next) {
            // Making the error handling a function here for convenience.
            let approved = checkRuleGroup(req, res, {
                mode: 'OR',
                rules: ruleStrings,
            });

            if (!approved) {
                const err = new Error('Forbidden: insufficient permission');
                err.status = 403;
                return next(err);
            }
            return next();
        };
    },
};
