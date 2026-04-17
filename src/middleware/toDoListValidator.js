import { body, query } from 'express-validator';
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
            .isLength({ min: 3, max: 64 })
            .withMessage(
                'The "title" field must be at least 8 characters and at most 64 characters',
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
            .exists({ values: 'falsy' })
            .withMessage('The "ownerId" is required')
            .bail()
            .trim()
            .escape()
            .isInt()
            .withMessage('The "ownerId" must be an integer')
            .bail()
            .isLength({ min: 3, max: 64 })
            .withMessage(
                'The "ownerId" must be at least 8 characters and at most 64 characters',
            ),

        handleValidationErrors,
    ],
};
