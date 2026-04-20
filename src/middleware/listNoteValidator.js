import { body, query, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export default {
    validateCreate: [
        body('name')
            .exists({ values: 'falsy' })
            .withMessage('The "name" field is required')
            .bail()
            .trim()
            .escape()
            .isString()
            .withMessage('The "name" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage('The "name" field must be at least 3 characters.'),

        body('content')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "content" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage('The "content" field must be at least 3 characters.'),

        body('listId')
            .exists({ values: 'falsy' })
            .withMessage('The "listId" field is required')
            .bail()
            .isInt()
            .withMessage('The "listId" field must be an integer'),

        handleValidationErrors,
    ],

    validateUpdate: [
        oneOf(
            [
                body('name').exists({ values: 'falsy' }),
                body('content').exists({ values: 'falsy' }),
            ],
            {
                message: 'At least one field (title, content) must be provided',
            },
        ),

        body('name')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "name" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage('The "name" field must be at least 3 characters.'),

        body('content')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "content" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage('The "content" field must be at least 3 characters.'),

        handleValidationErrors,
    ],
};
