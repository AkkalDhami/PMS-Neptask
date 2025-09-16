import { Router } from "express";
import { authRequired } from "../middlewares/auth.js";
import { createTask, deleteTask, getTasksByProjectId, updateTask, updateTaskStatus } from "../controllers/taskController.js";

const router = Router();


router.post('/create', authRequired, createTask);
router.get('/project/:projectId', authRequired, getTasksByProjectId);
// router.get('/user', getUserTasks);
// router.get('/:taskId', getTask);
router.put('/:taskId/update', authRequired, updateTask);
router.delete('/:taskId/delete', authRequired, deleteTask);
router.patch('/:taskId/update-status', authRequired, updateTaskStatus);
// router.post('/:taskId/notes', addNote);
// router.post('/:taskId/subtasks', addSubtask);

export default router;