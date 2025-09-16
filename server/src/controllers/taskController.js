import Project from "../models/Project.js";
import { TryCatch } from "../middlewares/tryCatch.js";
import Note from "../models/Note.js";
import Task from "../models/Task.js";
import Workspace from "../models/Workspace.js";
import Subtask from "../models/Subtask.js";

import mongoose from "mongoose";
import mjml2html from "mjml";
import fs from "fs";
import path from "path";
import { sendMessageToEmail } from "../utils/email.js";

//? CREATE NEW TASK
export const createTask = TryCatch(async (req, res) => {

    const userId = req.user._id;
    const validatedData = {
        ...req.body,
        project: req.body.project,
        reporter: userId
    };

    const project = await Project.findOne({
        _id: validatedData.project,
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
        return res.status(404).json({
            success: false,
            message: 'Workspace not found'
        });
    }

    const isMember = workspace.members.some(member => member.user.toString() === userId.toString());
    if (!isMember) {
        return res.status(403).json({
            success: false,
            message: 'You are not a member of this workspace'
        });
    }

    const isActive = project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })
    // Create the task
    const task = new Task(validatedData);


    await task.save();

    project.tasks.push(task._id);
    await project.save();
    project.calculateProgress()

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
    });
})

//? GET TASKS BY PROJECT ID
export const getTasksByProjectId = TryCatch(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        status,
        filter,
        sort = "newest",
        search,
    } = req.query;

    const { projectId } = req.params;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ success: false, message: "Invalid projectId" });
    }

    // --------------------
    // Build base query
    // --------------------
    const baseMatch = { project: new mongoose.Types.ObjectId(projectId), isActive: true };

    if (status && ["pending", "completed", "in-progress"].includes(status.toLowerCase())) {
        baseMatch.status = status.toLowerCase();
    }

    if (search) {
        baseMatch.name = { $regex: search, $options: "i" }; // search by task name (case-insensitive)
    }

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    if (filter) {
        switch (filter) {
            case "today":
                baseMatch.startDate = { $gte: startOfDay, $lte: endOfDay };
                break;
            case "overdue":
                baseMatch.dueDate = { $lt: new Date() };
                baseMatch.status = { $ne: "completed" };
                break;
            case "with-subtask":
                baseMatch["subtasks.0"] = { $exists: true };
                break;
            case "without-subtask":
                baseMatch.subtasks = { $size: 0 };
                break;
        }
    }

    // --------------------
    // Sorting
    // --------------------
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "dueDateAsc") sortOption = { dueDate: 1 };
    if (sort === "dueDateDesc") sortOption = { dueDate: -1 };

    // --------------------
    // Fetch paginated tasks
    // --------------------
    const tasks = await Task.find(baseMatch)
        .populate("assignedTo", "name email avatar")
        .populate("project", "name")
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit));

    const total = await Task.countDocuments(baseMatch);

    // --------------------
    // Aggregated counts
    // --------------------
    const countsAgg = await Task.aggregate([
        { $match: { project: new mongoose.Types.ObjectId(projectId), isActive: true } }, // all tasks in project
        {
            $facet: {
                all: [{ $count: "count" }],
                pending: [{ $match: { status: "pending" } }, { $count: "count" }],
                completed: [{ $match: { status: "completed" } }, { $count: "count" }],
                inProgress: [{ $match: { status: "in-progress" } }, { $count: "count" }],
                today: [
                    { $match: { startDate: { $gte: startOfDay, $lte: endOfDay } } },
                    { $count: "count" },
                ],
                overdue: [
                    { $match: { dueDate: { $lt: new Date() }, status: { $ne: "completed" } } },
                    { $count: "count" },
                ],
                withSubtask: [{ $match: { "subtasks.0": { $exists: true } } }, { $count: "count" }],
                withoutSubtask: [{ $match: { subtasks: { $size: 0 } } }, { $count: "count" }],
            },
        },
    ]);

    const formatCounts = (key) => countsAgg[0][key]?.[0]?.count || 0;

    const counts = {
        all: formatCounts("all"),
        pending: formatCounts("pending"),
        completed: formatCounts("completed"),
        inProgress: formatCounts("inProgress"),
        today: formatCounts("today"),
        overdue: formatCounts("overdue"),
        withSubtask: formatCounts("withSubtask"),
        withoutSubtask: formatCounts("withoutSubtask"),
    };

    // --------------------
    // Send response
    // --------------------
    res.status(200).json({
        success: true,
        data: {
            tasks,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit),
            },
            counts,
        },
    });
});

//? DELETE TASK
export const deleteTask = TryCatch(async (req, res) => {

    const { taskId } = req.params;

    const isTask = await Task.findById(taskId).populate('project', '_id name isActive');
    if (!isTask) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    const task = await Task.findOne({
        _id: taskId,
        $or: [
            { reporter: req.user._id },
            {
                project: {
                    $in: await Project.find({
                        $or: [
                            { createdBy: req.user._id },
                            { 'members.user': req.user._id, 'members.role': { $in: ['owner', 'admin'] } }
                        ]
                    }).distinct('_id')
                }
            }
        ]
    });

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Access denied. You do not have permission to delete this task.'
        });
    }


    // Delete the task
    const deletedTask = await Task.findOneAndDelete({ _id: taskId });
    console.log(isTask?.project);
    isTask.project.calculateProgress();
    res.json({
        success: true,
        message: 'Task deleted successfully',
        deletedTask
    });
});

//? UPDATE TASK
export const updateTask = TryCatch(async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user._id;
    const { title, description, dueDate, status, startDate, assignedTo, priority } = req.body;

    if (!taskId) {
        return res.status(400).json({
            success: false,
            message: "Task ID is required",
        });
    }

    // Fetch task first
    const isTask = await Task.findById(taskId).populate("project", "_id name isActive");
    if (!isTask) {
        return res.status(404).json({
            success: false,
            message: "Task not found",
        });
    }

    const task = await Task.findOneAndUpdate(
        { _id: taskId, $or: [{ reporter: userId }, { assignedTo: userId }] },
        { title, description, dueDate, status, startDate, assignedTo },
        { new: true }
    );

    if (!task) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You do not have permission to update this task.",
        });
    }

    // Handle priority separately (only reporter can update)
    if (priority) {
        if (String(task.reporter) !== String(userId)) {
            return res.status(403).json({
                success: false,
                message: "Only the reporter can update priority of this task.",
            });
        }
        task.priority = priority;
        await task.save();
    }

    if (isTask.project) {
        await isTask.project.calculateProgress();
    }

    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        task,
    });
});


// Add note to task
export const addNote = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Check if task exists and user has access
        const task = await Task.findOne({
            _id: taskId,
            $or: [
                { reporter: req.user._id },
                { assignedTo: req.user._id },
                {
                    project: {
                        $in: await Project.find({
                            $or: [
                                { createdBy: req.user._id },
                                { 'members.user': req.user._id }
                            ]
                        }).distinct('_id')
                    }
                }
            ]
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        // Validate note data
        const validatedData = noteSchema.parse(req.body);

        // Create note
        const note = new Note({
            ...validatedData,
            task: taskId
        });

        await note.save();

        // Add note to task
        task.notes.push(note._id);
        await task.save();

        res.status(201).json({
            success: true,
            message: 'Note added successfully',
            data: note
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors
            });
        }

        console.error('Error adding note:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Add subtask to task
export const addSubtask = async (req, res) => {
    try {
        const { taskId } = req.params;

        // Check if task exists and user has access
        const task = await Task.findOne({
            _id: taskId,
            $or: [
                { reporter: req.user._id },
                { assignedTo: req.user._id },
                {
                    project: {
                        $in: await Project.find({
                            $or: [
                                { createdBy: req.user._id },
                                { 'members.user': req.user._id }
                            ]
                        }).distinct('_id')
                    }
                }
            ]
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or access denied'
            });
        }

        // Validate subtask data
        const validatedData = subtaskSchema.parse(req.body);

        // Create subtask
        const subtask = new Subtask({
            ...validatedData,
            task: taskId
        });

        await subtask.save();

        // Add subtask to task
        task.subtasks.push(subtask._id);
        await task.save();

        res.status(201).json({
            success: true,
            message: 'Subtask added successfully',
            data: subtask
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors
            });
        }

        console.error('Error adding subtask:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//? UPDATE TASK STATUS
export const updateTaskStatus = TryCatch(async (req, res) => {
    const userId = req?.user?._id;
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId) return res.status(403).json({
        success: false,
        message: "Task Id is required"
    })

    const isTask = await Task.findById(taskId);
    if (!isTask) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    const prevStatus = isTask.status;

    const task = await Task.findOneAndUpdate(
        {
            _id: taskId,
            $or: [
                { reporter: userId },
                { assignedTo: userId },
                {
                    project: {
                        $in: await Project.find({
                            $or: [
                                { createdBy: userId },
                                { 'members.user': userId }
                            ]
                        }).distinct('_id')
                    }
                }
            ]
        },
        { status },
        { new: true }
    ).populate('assignedTo', 'name email avatar').populate('project', '_id name isActive');

    console.log(task);

    if (!task) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. You do not have permission to update this task.'
        });
    }

    const isActive = task?.project?.isActive
    if (!isActive) return res.status(403).json({
        success: false,
        message: 'This project has been locked'
    })

    if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();
        await task.save();
    }
    task?.project.calculateProgress()

    res.json({
        success: true,
        message: `Task status updated to ${status}`,
    });


});

// Get user's tasks
export const getUserTasks = async (req, res) => {
    try {
        const { status, priority, page = 1, limit = 10 } = req.query;
        // const userId = req.user._id;

        // Build filter
        const filter = {
            $or: [
                { assignedTo: userId },
                { reporter: userId },
                {
                    project: {
                        $in: await Project.find({
                            $or: [
                                { createdBy: userId },
                                { 'members.user': userId }
                            ]
                        }).distinct('_id')
                    }
                }
            ]
        };

        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        // Pagination
        const skip = (page - 1) * limit;

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email avatar')
            .populate('reporter', 'name email')
            .populate('project', 'name')
            .populate('subtasks')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(filter);

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching user tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//? SEND OVERDUE EMAIL
export const sendOverdueEmail = async (user, task) => {
    const overdueDays = Math.ceil((task.dueDate - Date.now()) / (1000 * 60 * 60 * 24));

    const admin = await Project.findOne({ _id: task.project, 'members.role': 'admin' }).populate('members.user', 'email');
    console.log(task);


    const templatePath = path.resolve(process.cwd(), 'src', 'templates', 'overdue-task.mjml');
    const mjml = fs.readFileSync(templatePath, 'utf8')
        .replace(/{{USERNAME}}/g, user.name || "Member")
        .replace(/{{TASK_TITLE}}/g, task.title)
        .replace(/{{PROJECT_NAME}}/g, task.project?.name || "N/A")
        .replace(/{{DUE_DATE}}/g, task.dueDate?.toDateString() || "N/A")
        .replace(/{{PRIORITY}}/g, task.priority || "N/A")
        .replace(/{{STATUS}}/g, task.status || "N/A")
        .replace(/{{OVERDUE_BY}}/g, overdueDays > 0 ? `${overdueDays} day(s)` : "Today")
        .replace(/{{PROJECT_LINK}}/g, `${process.env.CLIENT_URL}/projects/${task.project?._id}`)
        .replace(/{{TASK_LINK}}/g, `${process.env.CLIENT_URL}/projects/${task.project?._id}/tasks/${task._id}`)
        .replace(/{{ADMIN_EMAIL}}/g, admin.members[0].user.email || "akkal21@gmail.com")
        .replace(/{{CURR_YEAR}}/g, new Date().getFullYear())
        .replace(/{{APP_NAME}}/g, process.env.APP_NAME || "NepTask");

    const { html, errors } = mjml2html(mjml, { validationLevel: 'soft' });
    if (!html) {
        throw new Error('Failed to render OTP email');
    }
    await sendMessageToEmail({
        to: user.email,
        from: process.env.EMAIL_FROM,
        html,
        subject: 'Overdue Task Reminder',
    });
}
