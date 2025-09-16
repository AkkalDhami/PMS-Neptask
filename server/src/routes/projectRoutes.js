import { Router } from "express";
const router = Router();

import {
    createProject,
    deleteProject,
    getAllProjects,
    getProject,
    getProjects,
    updateProject,
} from "../controllers/projectController.js";

import { authRequired } from "../middlewares/auth.js";

router.get("/", authRequired, getProjects)
router.get("/all", authRequired, getAllProjects);
router.get("/:projectId", authRequired, getProject);

router.post("/create", authRequired, createProject);

router.put("/update/:projectId", authRequired, updateProject);
router.delete("/:projectId", authRequired, deleteProject);

export default router;