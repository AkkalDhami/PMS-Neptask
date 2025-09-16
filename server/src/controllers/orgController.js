import { TryCatch } from "../middlewares/tryCatch.js";
import Organization from "../models/Organization.js";
import User from "../models/User.js";

//? CREATE ORGANIZATION
export const createOrg = TryCatch(async (req, res) => {
    const { name, owner = req?.user?._id, orgEmail } = req.body;

    if (!owner) return res.status(401).json({
        success: false,
        message: "Owner is required!",
    })
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) return res.status(401).json({
        success: false,
        message: "Organization already registered!",
    })

    const existingOrgEmail = await Organization.findOne({ orgEmail });
    if (existingOrgEmail) return res.status(401).json({
        success: false,
        message: "Organization email is already registered!",
    })

    let logo = {};
    if (req.file) {
        logo = {
            public_id: req.file.filename,
            url: req.file.path
        }
    }
    const org = new Organization({
        name,
        logo,
        owner,
        orgEmail,
        members: [
            {
                user: owner,
                role: "owner",
                joinedAt: new Date(),
            },
        ],
    });

    await org.save();
    res.status(201).json({
        success: true,
        message: "Organization created successfully!",
    })
})

//? GET ORGANIZATIONS
export const getOrgs = TryCatch(async (req, res) => {
    let { page = 1, limit = 9 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const [orgs, totalCount] = await Promise.all([
        Organization.find()
            .populate("owner")
            .populate("members.user")
            .populate({
                path: "workspaces",
                populate: [
                    { path: "admin", select: "name _id email" },
                    { path: "members.user", select: "name _id email" },
                    { path: "organization", select: "name _id" },
                    { path: "projects" }
                ]
            })
            .skip(skip)
            .limit(limit),
        Organization.countDocuments()
    ]);

    if (!orgs || orgs.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No organizations found!",
        });
    }

    res.status(201).json({
        success: true,
        message: "Get Organizations",
        orgs,
        pagination: {
            total: totalCount,
            page,
            limit,
            hasMore: skip + orgs.length < totalCount,
        }
    })
})

//? GET A ORGANIZATION
export const getOrg = TryCatch(async (req, res) => {
    const org = await Organization.findById(req.params.id).populate("owner").populate("owner") // populate organization owner
        .populate("members.user")
        .populate({
            path: "workspaces",
            populate: [
                { path: "admin", select: "name _id email avatar" },
                { path: "members.user", select: "name _id email avatar" },
                { path: "organization", select: "name _id logo" },
                { path: "projects" }
            ]
        });
    res.status(201).json({
        success: true,
        message: "Get Organization",
        org
    })
})

//? DELETE ORGANIZATION
export const requestOrgDeletion = TryCatch(async (req, res) => {
    const { orgId } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const organization = await Organization.findById(orgId);

    if (!organization) {
        return res.status(404).json({
            success: false,
            message: 'Organization not found'
        });
    }

    // Check if user is owner
    if (organization.owner.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Only organization owner can delete the organization'
        });
    }

    // Check if deletion is already requested
    if (organization.isDeleted || organization.deletionRequestedAt) {
        return res.status(400).json({
            success: false,
            message: 'Deletion already requested for this organization'
        });
    }

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 28);

    organization.isDeleted = true;
    organization.deletionRequestedAt = new Date();
    organization.scheduledDeletionAt = deletionDate;
    organization.deletionReason = reason;
    organization.deletionRequestedBy = userId;

    await organization.save();

    // await sendDeletionConfirmationEmail(organization);

    res.status(200).json({
        success: true,
        message: 'Organization deletion scheduled. You have 28 days to recover.',
        data: {
            scheduledDeletionAt: deletionDate,
            recoveryDeadline: deletionDate
        }
    });
})

export const permanentlyDeleteOrganization = async (orgId) => {
    try {
        const organization = await Organization.findById(orgId);

        if (!organization || !organization.isDeleted) {
            return { success: false, message: 'Organization not found or not scheduled for deletion' };
        }

        if (new Date() < organization.scheduledDeletionAt) {
            return { success: false, message: 'Deletion period not yet completed' };
        }

        await Organization.deleteOne({ _id: orgId });


        return {
            success: true,
            message: 'Organization permanently deleted'
        };

    } catch (error) {
        console.error('Error permanently deleting organization:', error);
        return { success: false, message: 'Error during permanent deletion' };
    }
};

//? RECOVERY DELETION ORGANIZATION
export const recoverOrganization = TryCatch(async (req, res) => {

    const { orgId } = req.params;
    const userId = req.user._id;

    const organization = await Organization.findOne({
        _id: orgId,
        isDeleted: true
    });

    if (!organization) {
        return res.status(404).json({
            success: false,
            message: 'Organization not found or not scheduled for deletion'
        });
    }

    // Check if user is owner or admin
    const isOwner = organization.owner.toString() === userId.toString();
    const isAdmin = organization.members.some(m =>
        m.user.toString() === userId.toString() && ['owner', 'admin'].includes(m.role)
    );

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only owners and admins can recover organizations'
        });
    }

    // Check if recovery period has expired
    if (new Date() > organization.scheduledDeletionAt) {
        return res.status(400).json({
            success: false,
            message: 'Recovery period has expired. Organization cannot be recovered.'
        });
    }

    // Recover the organization
    organization.isDeleted = false;
    organization.deletionRequestedAt = null;
    organization.scheduledDeletionAt = null;
    organization.deletionReason = null;
    organization.deletionRequestedBy = null;
    organization.recoveredAt = new Date();

    await organization.save();

    // Send recovery confirmation email
    // await sendDeletionRecoveryEmail(organization);

    res.status(200).json({
        success: true,
        message: 'Organization recovered successfully',
    });

});

//? GET DELETION STATUS
export const getDeletionStatus = TryCatch(async (req, res) => {

    const { orgId } = req.params;

    const organization = await Organization.findById(orgId);

    if (!organization) {
        return res.status(404).json({
            success: false,
            message: 'Organization not found'
        });
    }

    res.status(200).json({
        success: true,
        data: {
            isDeleted: organization.isDeleted,
            deletionRequestedAt: organization.deletionRequestedAt,
            scheduledDeletionAt: organization.scheduledDeletionAt,
            deletionReason: organization.deletionReason,
            daysRemaining: organization.scheduledDeletionAt ?
                Math.ceil((organization.scheduledDeletionAt - new Date()) / (1000 * 60 * 60 * 24)) : null
        }
    });
});

//? ADD MEMBER
export const addMember = TryCatch(async (req, res) => {
    const { orgId: id } = req.params;
    const { user, role } = req.body;
    const org = await Organization.findById(id);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    org.members.push({ user, role });
    await org.save();
    res.status(200).json({
        success: true,
        message: "Member added successfully!",
    })
})

//? REMOVE MEMBER
export const removeMember = TryCatch(async (req, res) => {
    const { orgId: id, memberId } = req.params;

    const org = await Organization.findById(id);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    const isOwner = await Organization.findOne({ owner: memberId });
    if (isOwner) return res.status(401).json({
        success: false,
        message: "Owner cannot be removed!",
    });

    org.members = org.members.filter(member => member.user.toString() !== memberId);
    await org.save();
    res.status(200).json({
        success: true,
        message: "Member removed successfully!",
    })
})

//? UPDATE MEMBER ROLE
export const updateMemberRole = TryCatch(async (req, res) => {
    const { orgId: id, memberId } = req.params;
    const { role } = req.body;
    console.log(req.body, id, memberId);
    const org = await Organization.findById(id).populate("members.user");
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });
    const existingMember = org.members.find(member => member.user?._id.toString() === memberId);

    if (!existingMember) return res.status(401).json({
        success: false,
        message: "Member not found!",
    });

    if (existingMember.role === "owner") return res.status(401).json({
        success: false,
        message: "Owner cannot be updated!",
    });

    existingMember.role = role;
    existingMember.user.role = role;
    console.log(existingMember.user, role);
    await org.save();
    await User.findOneAndUpdate({ _id: existingMember.user._id }, { role });
    res.status(200).json({
        success: true,
        message: "Member role updated successfully!",
    })
});

//? UPDATE ORGANIZATION
export const updateOrg = TryCatch(async (req, res) => {
    const { orgId: id } = req.params;
    const { name } = req.body;
    const userId = req.user._id;
    const org = await Organization.findById(id);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!",
    });

    if (org.scheduledDeletionAt && org.scheduledDeletionAt > new Date()) return res.status(401).json({
        success: false,
        message: "Organization is scheduled for deletion!",
    });

    if (org.owner.toString() !== userId.toString()) return res.status(401).json({
        success: false,
        message: "You are not authorized to update this organization!",
    });
    if (req.file) {
        org.logo = {
            public_id: req.file.filename,
            url: req.file.path
        }
    }

    org.name = name;

    await org.save();
    res.status(200).json({
        success: true,
        message: "Organization updated successfully!",
    })
});