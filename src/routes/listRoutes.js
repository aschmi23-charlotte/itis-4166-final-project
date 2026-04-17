import express from 'express';
import toDoListValidator from '../middleware/toDoListValidator.js';
import listController from '../controllers/listController.js';
import permissionHandler from '../middleware/permissionHandler.js';

const router = express.Router();
router.post(
    '/',
    permissionHandler.authenticate,
    toDoListValidator.validateCreate,
    permissionHandler.authorizeAccessRules(
        'role:ADMIN',
        'newlist:owner_is_user',
    ),
    listController.create,
);
router.get('/', permissionHandler.authenticate, listController.getAll);
router.get(':list_id', permissionHandler.authenticate, listController.getById);
router.put(':list_id', permissionHandler.authenticate, listController.update);
router.delete(
    ':list_id',
    permissionHandler.authenticate,
    listController.delete,
);

export default router;
