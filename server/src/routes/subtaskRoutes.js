import { Router } from "express";
import {
    addSubtasks,
    deleteSubtask,
} from "../controllers/subtaskController.js";
import { authRequired } from "../middlewares/auth.js";

const router = Router();

router.post('/:taskId/add-subtasks', authRequired, addSubtasks);
router.delete('/delete/:subtaskId', authRequired, deleteSubtask);

export default router;