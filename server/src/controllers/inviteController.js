import fs from 'fs';
import path from 'path';
import mjml2html from 'mjml';
import crypto from 'crypto'

import Invitation from '../models/Invitation.js';
import User from '../models/User.js';
import Organization from '../models/Organization.js';

import { sendMessageToEmail } from '../utils/email.js'
import { TryCatch } from '../middlewares/tryCatch.js';
import mongoose from 'mongoose';

//? GENERATE TOKEN
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

//? SEND INVITATION
export const sendInvitation = async (req, res) => {
    try {
        const { email, role, message } = req.body;
        const { _id: userId } = req.user;
        const { orgId } = req.params;

        if (!email || !role) {
            return res.status(400).json({
                success: false,
                message: 'Email and role are required'
            });
        }

        const existingUser = await User.findOne({ email });
        const organization = await Organization.findById(orgId);
        if (existingUser) {

            const isAlreadyMember = organization.members.some(
                member => member.user.toString() === existingUser._id.toString()
            );

            if (isAlreadyMember) {
                return res.status(400).json({
                    success: false,
                    message: 'User is already a member of this organization'
                });
            }
        }

        const existingInvitation = await Invitation.findOne({
            email: email.toLowerCase(),
            meta: {
                organization: orgId
            },
            status: 'pending',
            invitedBy: userId
        });

        if (existingInvitation) {
            return res.status(401).json({
                success: false,
                message: 'A pending invitation already exists for this email'
            });
        }

        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const hashToken = crypto.createHash("sha256").update(String(token)).digest("hex");
        // Create invitation
        const invitation = new Invitation({
            email,
            role,
            message,
            invitedBy: userId,
            organization: orgId,
            token: hashToken,
            expiresAt,
            meta: {
                organization: orgId,
            }
        });

        await invitation.save();

        await invitation.populate('invitedBy', 'name email');
        // await invitation.populate('organization', 'name');


        const INVITE_LINK = `${process.env.CLIENT_URL}/invite/organization/${orgId}/${token}`
        const templatePath = path.resolve(process.cwd(), 'src', 'templates', 'invite-member.mjml');
        console.log(INVITE_LINK);
        const mjml = fs.readFileSync(templatePath, 'utf8')
            .replaceAll('{{INVITE_LINK}}', String(INVITE_LINK))
            .replaceAll('{{EMAIL}}', email)
            .replaceAll('{{INVITED_BY}}', req?.user?.name)
            .replaceAll('{{MESSAGE}}', message)
            .replaceAll('{{ROLE}}', role)
            .replaceAll('{{APP_NAME}}', process.env.APP_NAME)
            .replaceAll('{{ORG_NAME}}', organization?.name)
            .replaceAll('{{EXPIRES_AT}}', expiresAt.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" }))
            .replaceAll('{{CURRENT_YEAR}}', String(new Date().getFullYear().toString()));

        const { html, errors } = mjml2html(mjml, { validationLevel: 'soft' });
        if (!html) {
            throw new Error('Failed to render invitation email');
        }

        const subject = 'Invitation to join organization';
        await sendMessageToEmail({ to: email, from: process.env.EMAIL_FROM, html, subject });


        res.status(201).json({
            success: true,
            message: 'Invitation sent successfully',
            data: {
                invitation: {
                    _id: invitation._id,
                    email: invitation.email,
                    role: invitation.role,
                    status: invitation.status,
                    expiresAt: invitation.expiresAt,

                    meta: {
                        organization: orgId,
                    }

                }
            }
        });

    } catch (error) {
        console.error('Send invitation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending invitation'
        });
    }
};


//? ACCEPT INVITATION
export const acceptInvitation = TryCatch(async (req, res) => {

    const { token } = req.params;
    const { _id: userId } = req.user || {};

    if (!token) {
        return res.status(400).json({ success: false, message: "Invitation token is required" });
    }

    const hashToken = crypto.createHash("sha256").update(String(token)).digest("hex");
    const invitation = await Invitation.findOne({ token: hashToken });

    if (!invitation) {
        return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    // Validate expiry
    if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < Date.now()) {
        return res.status(400).json({ success: false, message: "Invitation has expired" });
    }

    // Validate status
    if (invitation.status !== "pending") {
        return res.status(400).json({ success: false, message: "Invitation is no longer valid" });
    }

    // Validate user if authenticated
    if (userId) {
        const user = await User.findById(userId).select("email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (String(user.email).toLowerCase() !== String(invitation.email).toLowerCase()) {
            return res.status(403).json({ success: false, message: "This invitation is for a different email address" });
        }
    }

    // Update invitation
    invitation.status = "accepted";
    invitation.acceptedBy = userId || null;
    invitation.acceptedAt = new Date();
    await invitation.save();

    // Add user to organization (atomic, prevents duplicates)
    if (userId && invitation?.meta?.organization) {
        await Organization.updateOne(
            { _id: invitation.meta.organization, "members.user": { $ne: userId } },
            {
                $push: {
                    members: {
                        user: userId,
                        role: invitation.role,
                        joinedAt: new Date(),
                    },
                },
            }
        );
    }

    return res.json({
        success: true,
        message: "Invitation accepted successfully",
        data: { organization: invitation?.meta?.organization },
    });

});

//? REJECT INVITATION
export const rejectInvitation = TryCatch(async (req, res) => {
    const { token } = req.params;
    const { _id: userId } = req.user || {};

    if (!token) {
        return res.status(400).json({ success: false, message: "Invitation token is required" });
    }
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required to reject invitation" });
    }

    const hashToken = crypto.createHash("sha256").update(String(token)).digest("hex");
    const invitation = await Invitation.findOne({ token: hashToken });

    if (!invitation) {
        return res.status(404).json({ success: false, message: "Invitation not found" });
    }

    // Expiry check
    if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < Date.now()) {
        return res.status(400).json({ success: false, message: "Invitation has expired" });
    }

    // Status check
    if (invitation.status !== "pending") {
        return res.status(400).json({ success: false, message: "Invitation is no longer valid" });
    }

    // User validation
    const user = await User.findById(userId).select("email");
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    if (String(user.email).toLowerCase() !== String(invitation.email).toLowerCase()) {
        return res.status(403).json({ success: false, message: "This invitation is for a different email address" });
    }

    // Update invitation
    invitation.status = "rejected";
    invitation.rejectedBy = userId;
    invitation.rejectedAt = new Date();
    await invitation.save();
    return res.json({
        success: true,
        message: "Invitation rejected successfully"
    });
});

//? GET INVITATIONS
export const getOrganizationInvitations = async (req, res) => {
    try {
        const { orgId } = req.params;
        const { status } = req.query;

        let query = { organization: orgId };
        if (status) {
            query.status = status;
        }

        const invitations = await Invitation.find(query)
            .populate('invitedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                invitations
            }
        });

    } catch (error) {
        console.error('Get invitations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching invitations'
        });
    }
};

//? GET INVITATION
export const getInvitationByToken = async (req, res) => {
    try {
        const { token } = req.params;

        const hashToken = crypto.createHash("sha256").update(String(token)).digest("hex");
        const invitation = await Invitation.findOne({ token: hashToken })
            .populate('invitedBy', 'name email')

        const org = await Organization.findById(invitation.meta?.organization);
        console.log(org);
        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: 'Invitation not found'
            });
        }

        // Check if invitation is expired
        if (invitation.expiresAt < new Date() || invitation.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Invitation has expired or is no longer valid'
            });
        }

        res.json({
            success: true,
            invitation: {
                _id: invitation._id,
                email: invitation.email,
                role: invitation.role,
                message: invitation.message,
                invitedBy: invitation.invitedBy,
                organization: invitation.organization,
                expiresAt: invitation.expiresAt,
                meta: {
                    organization: {
                        logo: org?.logo?.url,
                        name: org?.name
                    }
                }

            },
        });

    } catch (error) {
        console.error('Get invitation by token error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching invitation'
        });
    }
};

//? REVOKE INVITATION
export const revokeInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const { userId } = req.user;

        const invitation = await Invitation.findById(invitationId)
            .populate('organization');

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: 'Invitation not found'
            });
        }

        // Check if user has permission to revoke (must be org admin/owner)
        const organization = await Organization.findById(invitation.organization._id);
        const userMembership = organization.members.find(
            member => member.user.toString() === userId
        );

        if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to revoke invitations'
            });
        }

        // Update invitation status
        invitation.status = 'revoked';
        await invitation.save();

        res.json({
            success: true,
            message: 'Invitation revoked successfully'
        });

    } catch (error) {
        console.error('Revoke invitation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while revoking invitation'
        });
    }
};

//? RESEND INVITATION
export const resendInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const { userId } = req.user;

        const invitation = await Invitation.findById(invitationId)
            .populate('organization')
            .populate('invitedBy', 'name email');

        if (!invitation) {
            return res.status(404).json({
                success: false,
                message: 'Invitation not found'
            });
        }

        // Check if user has permission to resend
        const organization = await Organization.findById(invitation.organization._id);
        const userMembership = organization.members.find(
            member => member.user.toString() === userId
        );

        if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to resend invitations'
            });
        }

        // Generate new token and expiration
        const newToken = generateToken();
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + 7);

        invitation.token = newToken;
        invitation.expiresAt = newExpiresAt;
        invitation.status = 'pending';
        await invitation.save();

        // Send new invitation email
        try {
            await sendInvitationEmail(invitation);
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError);
        }

        res.json({
            success: true,
            message: 'Invitation resent successfully'
        });

    } catch (error) {
        console.error('Resend invitation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while resending invitation'
        });
    }
};
