// import { getPostById } from "../services/postService.js";

// A more robust authorization mechanism using identifier strings.
// Valid strings are:
// * role:{role} - the logged in user has this role. Example: 'role:ADMIN'
// * user:{id} - the logged in user is a specific user. Example: 'user:6'
// * user:me - the logged in user is matches the `user_id` parameter. Example: 'user:me'
export function authorizeUserAccessRules(...ruleStrings) {    
    return function (req, res, next) {
        // Making the error handling a function here for convenience.
        function throw_invalid_access_rule(str, explanation) {
            const err = new Error(`Internal Server Error: Invalid access rule ${str} - ${explanation}`);
            err.status = 500;
            return next(err);
        }

        let approved = false;

        ruleStrings.forEach(
            /**
             * @param {string} rule
             * @param {number} index
             */
            (rule) => {
                if (typeof rule === "string") {
                    if (!rule.includes(":")) {
                        throw_invalid_access_rule(rule, "the ':' seperator is missing");
                    }

                    let str_args = rule.split(":");
                    let str_type = str_args[0];
                    let str_val = str_args[1];

                    switch (str_type) {
                        case 'role':
                            // This is an approved role:
                            approved ||= req.user.role === str_val;
                            break;
                        case 'user':
                            if (str_val === 'me') {
                                // The logged in user is the user from user_id
                                approved ||= req.user.id === req.param_user_id;
                            } else {
                                // The logged in user is this specific user.
                                approved ||= req.user.id === parseInt(str_val);
                            }
                            break;
                        default:
                            throw_invalid_access_rule(rule, `invalid rule string type '${str_type}'`);
                    }
                }
                else {
                    throw_invalid_access_rule(rule, `invalid rule type '${typeof rule}'`);
                }                
            }
        );

        if (!approved) {
            const err = new Error('Forbidden: insufficient permission');
            err.status = 403;
            return next(err);
        }
        return next();
    };
}

export async function authorizeOwnership(req, res, next) {
    const id = parseInt(req.user.id);
    // const post = await getPostById(id);

    // if (post.authorId !== req.user.id) {
    //     const err = new Error("Forbidden: insufficient permission.");
    //     err.status = 403;
    //     return next(err);
    // }
    next();
}