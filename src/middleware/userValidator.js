import { body, oneOf } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { handleValidationErrors } from './handleValidationErrors.js';

const SIGNUP_ROLES = ['ADMIN', 'USER'];
const ALL_ROLES = ['ADMIN', 'USER'];

// Custom validation steps
function checkSignupRole(value) {
    if (SIGNUP_ROLES.includes(value)) {
        return true;
    } else {
        const err = new Error(
            `Currently, new users are restricted to the following roles: ${SIGNUP_ROLES.join(', ')}`,
        );
        throw err;
    }
}

function checkRole(value) {
    if (ALL_ROLES.includes(value)) {
        return true;
    } else {
        const err = new Error(`Valid roles are: ${ALL_ROLES.join(', ')}`);
        throw err;
    }
}

export default {
    validateSignup: [
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
            .withMessage(
                'Password must be at least 8 characters and at most 64 characters',
            ),

        body('role')
            .optional()
            .trim()
            .escape()
            .isString()
            .withMessage('If present, role must be a string')
            .bail()
            .custom(checkRole)
            .custom(checkSignupRole),

        handleValidationErrors,
    ],

    validateLogin: [
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
    ],

    loginLimiter: rateLimit({
        windowMs: 1 * 60 * 1000, // One minute
        limit: process.env.NODE_ENV === 'test' ? 1000 : 100,
        handler: function (req, res, next) {
            const err = new Error('Too many login requests. Try again later.');
            err.status = 429;
            next(err);
        },
    }),

    validateUpdate: [
        oneOf(
            [
                body('email').exists({ values: 'falsy' }),
                body('password').exists({ values: 'falsy' }),
            ],
            {
                message:
                    'At least one field (email, password) must be provided',
            },
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
    ],

    validatePatch: [
        body('role')
            .exists({ values: 'falsy' })
            .withMessage('role is required')
            .bail()
            .trim()
            .escape()
            .isString()
            .withMessage('role must be a string')
            .bail()
            .custom(checkRole),
        handleValidationErrors,
    ],
};
