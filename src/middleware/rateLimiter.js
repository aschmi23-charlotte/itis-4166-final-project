import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // One minute
    limit: process.env.NODE_ENV === 'test' ? 1000 : 100,
    handler: function (req, res, next) {
        const err = new Error('Too many login requests. Try again later.');
        err.status = 429;
        next(err);
    },
});
