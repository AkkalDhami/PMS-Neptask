import { Router } from "express";
import {
    addMembers,
    createWorkspace,
    getAllWorkspaces,
    getWorkspace,
    getWorkspaces,
    updateWorkspace
} from "../controllers/workspaceController.js";
import { authRequired } from "../middlewares/auth.js";
const router = Router();

router.get('/all', authRequired, getAllWorkspaces);
router.get("/", authRequired, getWorkspaces)
router.get('/:workspaceId', authRequired, getWorkspace);

router.post('/organization/:orgId/create', authRequired, createWorkspace);

router.put('/:workspaceId', authRequired, updateWorkspace);

router.post('/:workspaceId/members', authRequired, addMembers);
export default router;