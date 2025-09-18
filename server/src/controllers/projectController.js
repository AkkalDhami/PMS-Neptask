import Project from "../models/Project.js";

import { TryCatch } from "../middlewares/tryCatch.js";
import Workspace from "../models/Workspace.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

//? CREATE NEW PROJECT
export const createProject = TryCatch(async (req, res) => {
    const {
        name,
        isActive,
        workspace: workspaceId,
        description,
        startDate,
        dueDate,
        tags,
    } = req.body;

    // Find workspace
    const workspace = await Workspace.findById(workspaceId)
        .populate("members.user")
        .populate("organization"); // make sure org is available if needed

    if (!workspace) {
        return res.status(401).json({
            success: false,
            message: "Workspace not found!",
        });
    }

    // check if user is member
    const member = workspace.members.find(
        (m) => m.user._id.toString() === req.user._id.toString()
    );

    if (!member || !["owner", "admin", "manager"].includes(member.role)) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to create projects",
        });
    }

    const isOwner = workspace.members.some(
        (m) => m.user._id.toString() === req.user._id.toString() && m.role === "owner"
    );
    const isManager = workspace.members.some(
        (m) => m.user._id.toString() === req.user._id.toString() && m.role === "manager"
    );

    const admin = req.user._id;

    // Members assignment
    let members;
    if (isOwner) {
        members = [
            {
                user: admin,
                role: "owner",
                joinedAt: new Date(),
            },
        ];
    } else if (isManager) {
        members = [
            {
                user: admin,
                role: "manager",
                joinedAt: new Date(),
            },
            {
                user: workspace.organization.owner, // ✅ not org.owner
                role: "owner",
                joinedAt: new Date(),
            },
        ];
    } else {
        members = [
            {
                user: workspace.organization.owner, // ✅ not org.owner
                role: "owner",
                joinedAt: new Date(),
            },
            {
                user: admin,
                role: "admin",
                joinedAt: new Date(),
            },
        ];
    }

    // Create project
    const project = await Project.create({
        name,
        description,
        createdBy: req.user._id,
        workspace: workspaceId,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        tags,
        members,
        isActive: isActive ?? true,
    });

    res.status(201).json({
        success: true,
        message: "Project created successfully",
        project, // ✅ return the project for frontend
    });
});


//? UPDATE PROJECT
export const updateProject = TryCatch(async (req, res) => {
    const { projectId } = req.params;
    const updates = req.body;

    if (!(projectId)) {
        return res.status(400).json({
            success: false,
            message: 'project ID is required'
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    // Check if user has permission to update (owner or admin)
    const userMembership = project.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'manager', 'admin'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to update this project'
        });
    }

    const isActive = project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })

    // Update project
    Object.keys(updates).forEach(key => {
        project[key] = updates[key];
    });

    await project.save();

    res.status(200).json({
        success: true,
        message: 'Project updated successfully',
    });
});

//? DELETE PROJECT
export const deleteProject = TryCatch(async (req, res) => {
    const { projectId } = req.params;

    if (!(projectId)) {
        return res.status(400).json({
            success: false,
            message: 'project ID is required'
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    // Check if user has permission to delete (owner or admin)
    const userMembership = project.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'manager', 'admin'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to delete this project'
        });
    }

    const isActive = project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })

    // Delete project
    await Project.findOneAndDelete({ _id: projectId });

    res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
    });
});

//? GET ALL PROJECTS
export const getAllProjects = TryCatch(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        priority,
        search,
    } = req.query;

    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
        ];
    }


    const projects = await Project.find(filter)
        .populate('createdBy', 'name email')
        .populate('workspace', 'name color')
        .populate('members.user', 'name avatar email')
        .populate('tasks')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Project.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: {
            projects,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

//? GET PROJECTS BY WORKSPACE
export const getProjectsByWorkspace = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;
    const {
        page = 1,
        limit = 10,
    } = req.query;

    const skip = (page - 1) * limit;

    const projects = await Project.find({ workspace: workspaceId })
        .populate('createdBy', 'name email')
        .populate('workspace', 'name color')
        .populate('members.user', 'name avatar email')
        .populate('tasks')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Project.countDocuments(filter);
    res.status(200).json({
        success: true,
        projects,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    })
})

//? GET PROJECTS
export const getProjects = TryCatch(async (req, res) => {
    const projects = await Project.find().populate("members.user", "name email avatar").populate("workspace", "name color _id");
    res.status(200).json({
        success: true,
        projects
    })
})

//? GET PROJECT
export const getProject = TryCatch(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        return res.status(400).json({
            success: false,
            message: "project ID is required",
        });
    }

    const project = await Project.findById(projectId)
        .populate("createdBy", "name _id email avatar")
        .populate("workspace", "name color _id")
        .populate("members.user", "name email avatar")
        .populate("tasks");

    if (!project) {
        return res.status(404).json({
            success: false,
            message: "Project not found",
        });
    }

    // 🔹 Aggregate task statistics for this project
    const taskStats = await Task.aggregate([
        { $match: { project: new mongoose.Types.ObjectId(projectId) } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // Convert aggregation result into key-value stats
    const statsMap = taskStats.reduce(
        (acc, cur) => {
            acc[cur._id] = cur.count;
            return acc;
        },
        { pending: 0, "in-progress": 0, completed: 0 }
    );

    // Get additional info
    const totalTasks = statsMap.pending + statsMap["in-progress"] + statsMap.completed;

    const highPriority = await Task.countDocuments({
        project: projectId,
        priority: "high",
    });

    const overdueTasks = await Task.countDocuments({
        project: projectId,
        dueDate: { $lt: new Date() },
        status: { $ne: "completed" },
    });

    res.status(200).json({
        success: true,
        project,
        stats: {
            totalTasks,
            pending: statsMap.pending,
            inProgress: statsMap["in-progress"],
            completed: statsMap.completed,
            highPriority,
            overdueTasks,
        },
    });
});

//? ADD MEMBER
export const addMember = TryCatch(async (req, res) => {
    const { projectId } = req.params;
    const { user, role } = req.body;

    if (!(projectId)) {
        return res.status(400).json({
            success: false,
            message: 'project ID is required'
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    // Check if user has permission to add member (owner or admin)
    const userMembership = project.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'admin', 'manager'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to add members to this project'
        });
    }
    const isActive = project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })
    // Add member to project
    project.members.push({ user, role });
    await project.save();

    res.status(200).json({
        success: true,
        message: 'Member added successfully'
    });
});

//? REMOVE MEMBER
export const removeMember = TryCatch(async (req, res) => {
    const { projectId, memberId } = req.params;

    if (!(projectId)) {
        return res.status(400).json({
            success: false,
            message: 'project ID is required'
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    const userMembership = project.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'admin', 'manager'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to remove members from this project'
        });
    }

    const isActive = project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })
    project.members = project.members.filter(member =>
        member.user.toString() !== memberId.toString()
    );
    await project.save();

    res.status(200).json({
        success: true,
        message: 'Member removed successfully'
    });
});

//! GET PROJECT STATS
export const getProjectStats = TryCatch(async (req, res) => {
    const { workspaceId } = req.params;

    const filter = { isActive: true };
    if (workspaceId && (workspaceId)) {
        filter.workspace = workspaceId;
    }

    const stats = await Project.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalProjects: { $sum: 1 },
                completedProjects: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                inProgressProjects: {
                    $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
                },
                inPendingProjects: {
                    $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                },
                overdueProjects: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ['$status', 'completed'] },
                                    { $ne: ['$status', 'cancelled'] },
                                    { $lt: ['$dueDate', new Date()] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                averageProgress: { $avg: '$progress' }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: stats[0] || {
            totalProjects: 0,
            completedProjects: 0,
            inProgressProjects: 0,
            inPendingProjects: 0,
            overdueProjects: 0,
            averageProgress: 0
        }
    });
});

//? UPDATE PROJECT ACTIVE
export const updateProjectActive = TryCatch(async (req, res) => {
    const { projectId } = req.params;
    const { isActive } = req.body;

    if (!(projectId)) {
        return res.status(400).json({
            success: false,
            message: 'project ID is required'
        });
    }

    const project = await Project.findById(projectId);
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    const userMembership = project.members.find(member =>
        member.user.toString() === req.user._id.toString()
    );

    if (!userMembership || !['owner', 'admin'].includes(userMembership.role)) {
        return res.status(403).json({
            success: false,
            message: 'You do not have permission to update this project'
        });
    }

    project.isActive = isActive;
    project.lockedAt = isActive ? null : Date.now();
    project.lockedBy = isActive ? null : req.user._id;
    await project.save();

    res.status(200).json({
        success: true,
        message: 'Project updated successfully'
    });
});