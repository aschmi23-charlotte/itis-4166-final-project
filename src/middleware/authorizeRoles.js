
export function authorizeRoles(...allowedRoles) {
    return function (req, res, next) {
        if (!allowedRoles.includes(req.user.role)) {
            const err = new Error("Forbidden: insufficient permission");
            err.status = 403;
            return next(err);
        }
        return next();
    };
}