import { body, query, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export default {
    validateCreate: [
        body('title')
            .exists({ values: 'falsy' })
            .withMessage('The "title" field is required')
            .bail()
            .trim()
            .escape()
            .isString()
            .withMessage('The "title" field must be a string')
            .bail()
            .isLength({ min: 3})
            .withMessage(
                'The "title" field must be at least 3 characters and at most 64 characters',
            ),

        body('isPublic')
            .optional()
            .trim()
            .escape()
            .isBoolean()
            .withMessage(
                'If present, the "isPublic" must be a boolean (true or false)',
            ),

        body('ownerId')
            .optional()
            .trim()
            .escape()
            .isInt()
            .withMessage('If present, the "ownerId" must be an integer')
            .bail()
            .isLength({ min: 3, max: 64 })
            .withMessage(
                'If present, The "ownerId" must be at least 8 characters and at most 64 characters',
            ),

        handleValidationErrors,
    ],

    validateUpdate: [
        oneOf(
            [
            body('title').exists({ values: 'falsy' }),
            body('isPublic').exists({ values: 'undefined' }),
            ],
            { message: 'At least one field (title, isPublic) must be provided' },
        ),

        body('title')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('The "title" field must be a string')
            .bail()
            .isLength({ min: 3})
            .withMessage(
                'The "title" field must be at least 3 characters and at most 64 characters',
            ),

        body('isPublic')
            .optional()
            .trim()
            .escape()
            .isBoolean()
            .withMessage(
                'If present, the "isPublic" must be a boolean (true or false)',
            ),

        handleValidationErrors,
    ]
};
