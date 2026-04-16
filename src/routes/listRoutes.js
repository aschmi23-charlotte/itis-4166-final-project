import express from 'express';
import listController from '../controllers/listController.js';
import {
    validateGetTasksQueries,
    validateTask,
} from '../middleware/validateList.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateUserIdParam, handleUserParamIsMe } from '../middleware/validateUserIdParam.js'
import { validateUpdateUser } from '../middleware/userValidators.js';
import { authorizeUserAccessRules } from '../middleware/authorizeUser.js';

const router = express.Router();
router.post('/', authenticate, listController.create);
router.get('/', authenticate, listController.getAll);
router.get(":list_id", authenticate, listController.getById);
router.put(":list_id", authenticate, listController.update);
router.delete(":list_id", authenticate, listController.delete);
    

export default router;
