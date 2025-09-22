import { TryCatch } from "../middlewares/tryCatch.js";
import Subtask from "../models/Subtask.js";
import Task from "../models/Task.js";

//? ADD SUBTASKS
export const addSubtasks = TryCatch(async (req, res) => {
    const { subtasks } = req.body;
    const { taskId } = req.params;

    const userId = req?.user?._id;
    if (!taskId || !Array.isArray(subtasks)) {
        return res.status(400).json({
            success: false,
            message: "Invalid data"
        });
    }

    const task = await Task.findById(taskId).populate({
        path: "project",
        select: "members.user  _id"
    });
   
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const isMember = task.project.members.some(member => member.user.toString() === userId.toString());
    if (!isMember) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not a member of this project"
        });
    }

    if (task.assignedTo.toString() !== userId.toString() || task.reporter.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not authorized to add subtasks to this task."
        });
    }

    const existingSubtasks = await Subtask.find({ title: { $in: subtasks.map(st => st.title) }, task: taskId });
    if (existingSubtasks.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Subtask already exist for this task"
        });
    }

    const subtaskDocs = subtasks.map(subtask => ({
        title: subtask.title,
        completed: subtask.completed || false,
        task: taskId
    }));

    const savedSubtasks = await Subtask.insertMany(subtaskDocs);
   
    task.subtasks.push(...savedSubtasks.map(st => st._id));
    await task.save();

    res.status(200).json({
        success: true,
        message: "Subtasks added successfully",
    });
});

//? DELETE SUBTASK
export const deleteSubtask = TryCatch(async (req, res) => {
    const { subtaskId } = req.params;
    const userId = req?.user?._id;

    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
        return res.status(404).json({
            success: false,
            message: "Subtask not found"
        });
    }

    const task = await Task.findById(subtask.task);
    if (!task) {
        return res.status(404).json({
            success: false,
            message: "Task not found"
        });
    }

    const isMember = task.project.members.includes(userId);
    if (!isMember) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not a member of this project"
        });
    }

    if (task.assignedTo.toString() !== userId.toString() || task.reporter.toString() !== userId.toString()) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You are not authorized to delete this subtask."
        });
    }

    await Subtask.findByIdAndDelete(subtaskId);

    res.status(200).json({
        success: true,
        message: "Subtask deleted successfully"
    });
});