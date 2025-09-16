import express from 'express';
import { acceptInvitation, getInvitationByToken, getOrganizationInvitations, rejectInvitation, resendInvitation, revokeInvitation, sendInvitation } from '../controllers/inviteController.js';
import { authRequired, isAuthenticated } from '../middlewares/auth.js';
import { invitationLimiter } from '../utils/rateLimiter.js';
const router = express.Router();


router.get('/token/:token', authRequired, getInvitationByToken);
router.post('/token/:token/accept', invitationLimiter, authRequired, isAuthenticated, acceptInvitation);
router.post('/token/:token/reject', rejectInvitation);

router.post('/organization/:orgId', authRequired, sendInvitation);
router.get('/organization/:orgId', authRequired, getOrganizationInvitations);
router.delete('/:invitationId', authRequired, revokeInvitation);
router.post('/:invitationId/resend', authRequired, resendInvitation);

export default router;