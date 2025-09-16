import { Router } from "express";
import { authRequired, isAuthenticated } from "../middlewares/auth.js";
import { addMember, createOrg, getDeletionStatus, getOrg, getOrgs, recoverOrganization, removeMember, requestOrgDeletion, updateMemberRole, updateOrg } from "../controllers/orgController.js";
import upload from "../middlewares/upload.js";
import { authorizeOrg } from "../middlewares/rbac.js";
const router = Router();

router.get("/", getOrgs);
router.get("/:id", authRequired, getOrg);

router.post("/create", authRequired, upload.single('logo'), createOrg);
router.put("/update/:orgId", authRequired, upload.single('logo'), updateOrg);

router.post("/:orgId/delete-request", authRequired, requestOrgDeletion);
router.post("/:orgId/recover", authRequired, recoverOrganization);
router.get("/:orgId/deletion-status", authRequired, getDeletionStatus);

router.route('/:orgId/members')
    .post(addMember);

router.route('/:orgId/members/:memberId')
    .delete(removeMember)
    .put(updateMemberRole);

export default router;