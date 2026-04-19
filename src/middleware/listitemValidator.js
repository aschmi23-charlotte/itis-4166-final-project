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
            .withMessage(
                'The "name" field must be at least 3 characters.',
            ),
        
        body('details')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "details" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage(
                'The "details" field must be at least 3 characters.',
            ),

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
                body('title').exists({ values: 'falsy' }),
                body('details').exists({ values: 'falsy' }),
            ],
            {
                message:
                    'At least one field (title, details) must be provided',
            },
        ),

        body('title')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "title" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage(
                'The "name" field must be at least 3 characters.',
            ),

        body('title')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, the "details" field must be a string')
            .bail()
            .isLength({ min: 3 })
            .withMessage(
                'The "details" field must be at least 3 characters.',
            ),

        handleValidationErrors,
    ],
};
