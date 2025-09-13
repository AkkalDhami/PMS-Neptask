import { TryCatch } from "../middlewares/tryCatch.js";
import Workspace from "../models/Workspace.js";
import Organization from "../models/Organization.js";

//? CREATE NEW WORKSPACE
export const createWorkspace = TryCatch(async (req, res) => {
    const { name, description, isActive, color, admin = req?.user?._id } = req.body;
    const { orgId } = req.params;

    const org = await Organization.findById(orgId);
    if (!org) return res.status(401).json({
        success: false,
        message: "Organization not found!"
    });

    const existingWorkspace = await Workspace.findOne({ name });
    if (existingWorkspace) return res.status(401).json({
        success: false,
        message: "Workspace already exists!"
    });

    const isOwner = org.owner?.toString() === admin?.toString();

    const members = isOwner ? [{
        user: admin,
        role: "owner"
    }] : [
        {
            user: admin,
            role: "admin",
            joinedAt: new Date()
        },
        {
            user: org.owner,
            role: "owner",
            joinedAt: new Date()
        }
    ]


    const workspace = await Workspace.create({
        name,
        description,
        isActive,
        color,
        admin,
        organization: orgId,
        members
    });

    await Organization.findByIdAndUpdate(
        orgId,
        { $push: { workspaces: workspace._id } },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: "Workspace created successfully!",
        data: workspace
    })

});

//? UPDATE WORKSPACE
export const updateWorkspace = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;
    if (!workspaceId) return res.status(401).json({
        success: false,
        message: "Workspace ID is required!"
    });
    const userId = req.user._id;
    const { name, description, color, isActive } = req.body;

    const workspace = await Workspace.findById(workspaceId)
        .populate("admin", "_id name email")
        .populate("members.user", "_id name email");

    if (!workspace) {
        return res.status(404).json({
            success: false,
            message: "Workspace not found"
        });
    }

    const isAdmin = workspace.admin._id.toString() === userId.toString();
    const memberRole = workspace.members.find(
        (m) => m.user._id.toString() === userId.toString()
    )?.role;

    if (!isAdmin && memberRole !== "owner") {
        return res.status(403).json({
            success: false,
            message: "Not authorized to update this workspace"
        });
    }

    const isValidHexColor = (color) => /^#([0-9A-F]{3}){1,2}$/i.test(color);
    // 3. Validate inputs
    if (color && !isValidHexColor(color)) {
        return res.status(400).json({
            success: false,
            message: "Invalid color format. Use HEX code."
        });
    }

    if (name) workspace.name = name.trim();
    if (description !== undefined) workspace.description = description.trim();
    if (color) workspace.color = color;
    if (typeof isActive === "boolean") workspace.isActive = isActive;

    await workspace.save();


    return res.json({
        success: true,
        message: "Workspace updated successfully",
    });
})


//? GET ALL WORKSPACES
export const getAllWorkspaces = TryCatch(async (req, res) => {
    let { page = 1, limit = 9 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const skip = (page - 1) * limit;

    const [workspaces, totalCount] = await Promise.all([
        Workspace.find()
            .populate("organization")
            .populate("members.user")
            .populate("admin")
            .populate("projects")
            .skip(skip)
            .limit(limit),
        Workspace.countDocuments()
    ]);

    if (!workspaces || workspaces.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No workspaces found!",
        });
    }

    res.status(200).json({
        success: true,
        message: "Workspaces fetched successfully!",
        workspaces,
        pagination: {
            total: totalCount,
            page,
            limit,
            hasMore: skip + workspaces.length < totalCount,
        },
    });
});

export const getWorkspaces = TryCatch(async (req, res) => {
    const workspaces = await Workspace.find().populate("organization").populate("members.user").populate("admin").populate("projects");
    res.status(200).json({
        success: true,
        message: "Workspaces fetched successfully!",
        workspaces
    });
});


//? GET A WORKSPACE
export const getWorkspace = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;
    if (!workspaceId) return res.status(401).json({
        success: false,
        message: "Workspace not found!"
    });

    const workspace = await Workspace.findById(workspaceId).populate("organization").populate("members.user").populate("admin").populate("projects");
    if (!workspace) return res.status(401).json({
        success: false,
        message: "Workspace not found!"
    });

    res.status(200).json({
        success: true,
        message: "Workspace fetched successfully!",
        workspace
    });
});

//? DELETE A WORKSPACE
export const requestWorkspaceDeletion = TryCatch(async (req, res) => {
    const { workspaceId, orgId, userId = req?.user?._id } = req.params;
    const { reason } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) return res.status(401).json({
        success: false,
        message: "Workspace not found!"
    });

    if (workspace.organization.toString() !== orgId) return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this workspace!"
    });

    if (workspace.admin.toString() !== userId) return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this workspace!"
    });

    if (workspace.isDeleted || workspace.deletionRequestedAt) return res.status(401).json({
        success: false,
        message: "Deletion already requested for this workspace!"
    });

    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 12);

    workspace.isDeleted = true;
    workspace.deletionRequestedAt = new Date();
    workspace.scheduledDeletionAt = deletionDate;
    workspace.deletionReason = reason;
    workspace.deletionRequestedBy = userId;

    await workspace.save();

    await Workspace.findByIdAndDelete();
    res.status(200).json({
        success: true,
        message: `Workspace deletion scheduled. You have 12 days to recover.`,
    });
});

export const permanentlyDeleteWorkspace = TryCatch(async (workspaceId) => {

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return {
        success: false,
        message: "Workspace not found!"
    };

    if (!workspace.isDeleted || !workspace.deletionRequestedAt) return {
        success: false,
        message: "Deletion not requested for this workspace!"
    };

    if (workspace.scheduledDeletionAt < new Date()) return {
        success: false,
        message: "Deletion already completed for this workspace!"
    };


    if (new Date() < workspace.scheduledDeletionAt) return ({
        success: false,
        message: "Deletion period not yet completed"
    });

    await Workspace.deleteOne({ _id: workspaceId });
    return ({
        success: true,
        message: "Workspace permanently deleted!",
    });
});

//? RECOVER A WORKSPACE
export const recoverWorkspace = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;
    const userId = req?.user?._id;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(401).json({
        success: false,
        message: "Workspace not found!"
    });

    if (!workspace.isDeleted || !workspace.deletionRequestedAt) return res.status(401).json({
        success: false,
        message: "Deletion not requested for this workspace!"
    });

    if (workspace.scheduledDeletionAt < new Date()) return res.status(401).json({
        success: false,
        message: "Recovery period has expired. This workspace cannot be recovered."
    });

    if (new Date() < workspace.scheduledDeletionAt) return res.status(401).json({
        success: false,
        message: "Deletion period not yet completed"
    });

    const org = await Organization.findOne({ owner: userId });
    const isOwner = org.owner.toString() === userId.toString();
    const isAdmin = org.members.some(m =>
        m.user.toString() === userId.toString() && ['owner', 'admin'].includes(m.role)
    );

    if (!isOwner && !isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Only owners and admins can recover workspaces'
        });
    }

    workspace.isDeleted = false;
    workspace.deletionRequestedAt = null;
    workspace.scheduledDeletionAt = null;
    workspace.deletionReason = null;
    workspace.deletionRequestedBy = null;
    workspace.recoveredAt = new Date();
    workspace.recoveredBy = userId;

    await workspace.save();

    res.status(200).json({
        success: true,
        message: "Workspace recovered successfully!",
    });
});

//? ADD MEMBER
export const addMember = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;
    const { user, role } = req.body;

    if (!(workspaceId)) {
        return res.status(400).json({
            success: false,
            message: 'workspace ID is required'
        });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
        return res.status(404).json({
            success: false,
            message: 'Workspace not found'
        });
    }

    // Check if user has permission to add member (owner or admin)
    const userMembership = workspace.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to add members to this workspace'
        });
    }

    const newMember = {
        user,
        role
    };

    workspace.members.push(newMember);
    await workspace.save();

    res.status(200).json({
        success: true,
        message: 'Member added successfully'
    });
});