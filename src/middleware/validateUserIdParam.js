import { param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateSignup = [
    oneOf(
        [
            body('title').exists({ values: 'falsy' }),
            body('content').exists({ values: 'falsy' }),
        ],
        { message: 'At least one field (title, content) must be provided' },
    ),
    handleValidationErrors,
];

export async function handleUserParamIsMe(req, res, next) {
    let user_id_str = req.params.user_id;
    if (user_id_str === 'me') {
        req.param_user_id = req.user.id;
    } else {
        req.param_user_id = parseInt(user_id_str);
    }

    next();
}
