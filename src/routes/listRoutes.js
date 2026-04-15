import express from 'express';
import * as listController from '../controllers/listController.js';
import { validateGetTasksQueries, validateTask } from '../middleware/validateTask.js';

const router = express.Router();

router.get('/', validateGetTasksQueries, taskController.getTasks);
router.post('/', validateTask, taskController.createTask);

export default router;
