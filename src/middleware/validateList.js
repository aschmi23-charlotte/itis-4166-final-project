import { body, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateGetTasksQueries = [
    query('completed')
        .optional()
        .isBoolean()
        .withMessage('If present, completed must be true or false'),

    handleValidationErrors,
];

export const validateToDoList = [
    body('title')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be at least 3 and at most 100 characters'),

    body('completed')
        .optional()
        .isBoolean()
        .withMessage('completed must be true or false'),

    handleValidationErrors,
];
