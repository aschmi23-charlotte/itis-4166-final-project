import express from 'express';
import * as listController from '../controllers/listController.js';
import { validateGetTasksQueries, validateTask } from '../middleware/validateTask.js';

const router = express.Router();

export default router;
