import express from 'express';

import { changeUserRole, getAllUsers, getUserOrgs, getUserTasks } from '../controllers/userController.js';
import { authRequired } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllUsers)
router.get('/tasks/:userId', getUserTasks)

router.post('/change-role/:userId', authRequired, changeUserRole);
router.get("/orgs/:userId", getUserOrgs);

export default router;