import express from 'express';

import { getAllUsers, getUserTasks } from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers)
router.get('/tasks/:userId', getUserTasks)

export default router;