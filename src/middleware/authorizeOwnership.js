import { getPostById } from "../services/postService.js";

export async function authorizeOwnership(req, res, next) {
    const id = parseInt(req.user.id);
    const post = await getPostById(id);

    if (post.authorId !== req.user.id) {
        const err = new Error("Forbidden: insufficient permission.");
        err.status = 403;
        return next(err);
    }
    next();
}