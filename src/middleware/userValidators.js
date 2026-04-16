import { param, body, oneOf, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateSignup = [
    body('email')
        .exists({ values: 'falsy' })
        .withMessage('Email address is required')
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Email address must be a string')
        .bail()
        .isEmail()
        .withMessage('Not a valid email address')
        .normalizeEmail()
        .bail(),

    body('password')
        .exists({ values: 'falsy' })
        .withMessage('Password is required')
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Password must be a string')
        .bail()
        .isLength({ min: 8, max: 64 })
        .withMessage('Password must be at least 8 characters and at most 64 characters'),
    
    body("role")
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage('If present, role must be a string')
        .bail()
        .custom((value) => {
            if(["USER", "ADMIN"].includes(value)) {
                return true;
            } else {
                const err = new Error("If present, role must be either USER or ADMIN");
                throw err;
            }
        }),

  handleValidationErrors,
];

export const validateLogin = [
    body('email')
        .exists({ values: 'falsy' })
        .withMessage('Email address is required')
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Email address must be a string')
        .bail()
        .isEmail()
        .withMessage('Not a valid email address')
        .normalizeEmail()
        .bail(),

    body('password')
        .exists({ values: 'falsy' })
        .withMessage('Password is required')
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Password must be a string')
        .bail(),

  handleValidationErrors,
];

export const validateUpdateUser= [
    oneOf(
        [
            body('email').exists({ values: 'falsy' }),
            body('password').exists({ values: 'falsy' }),
        ],
        { message: 'At least one field (email, password) must be provided' },
    ),

    body('email')
        .optional()
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Email address must be a string')
        .bail()
        .isEmail()
        .withMessage('Not a valid email address')
        .normalizeEmail()
        .bail(),

    body('password')
        .optional()
        .bail()
        .trim()
        .escape()
        .isString()
        .withMessage('Password must be a string')
        .bail(),

  handleValidationErrors,
];