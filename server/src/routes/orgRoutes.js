import { Router } from "express";
import { authRequired, isAuthenticated } from "../middlewares/auth.js";
import { addMember, createOrg, deleteOrg, getOrg, getOrgs, removeMember, updateMemberRole } from "../controllers/orgController.js";
import upload from "../middlewares/upload.js";
const router = Router();

router.get("/", getOrgs);
router.get("/:id", getOrg);

router.post("/create", authRequired, upload.single('logo'), createOrg);
router.delete("/delete/:id", deleteOrg);

router.route('/:orgId/members')
    .post(addMember);

router.route('/:orgId/members/:memberId')
    .delete(removeMember)
    .put(updateMemberRole);

export default router;