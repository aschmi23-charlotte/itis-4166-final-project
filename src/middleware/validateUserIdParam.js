import { param, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateUserIdParam = [
    oneOf(
        [
            param('user_id')
                .isInt()
                .bail()
            ,
            param('user_id')
                .isString()
                .equals("me")
                .bail()
            ,
        ],
        { message: "URL parameter 'user_id' must be an integer, or the string 'me'" },
    ),
    handleValidationErrors,
];

// Store the id for the user specified in the request object
export async function handleUserParamIsMe(req, res, next) {
    let user_id_str = req.params.user_id;
    if (user_id_str === 'me') {
        req.param_user_id = req.user.id;
    } else {
        req.param_user_id = parseInt(user_id_str);
    }

    next();
}
