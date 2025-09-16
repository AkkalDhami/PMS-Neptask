import mongoose from "mongoose";
import Subtask from "./Subtask.js";
import Note from "./Note.js";
import Project from "./Project.js";

const taskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true
    },
    category: String,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    repeat: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'],
        default: 'none'
    },
    remainder: {
        type: String,
        default: "0"
    },
    startDate: Date,
    dueDate: Date,
    completedAt: Date,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    attachments: [{
        public_id: { type: String },
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        filetype: { type: String, required: true },
        fileSize: { type: String, required: true },
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
        uploadedAt: { type: Date, default: Date.now() },
    }],
    subtasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtask',
    }],
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
    }],
    lastNotified: Date
}, { timestamps: true });

taskSchema.pre("findOneAndDelete", async function (next) {
    try {
        const taskId = this.getQuery()._id;
        if (!taskId) return next();

        await Subtask.deleteMany({ task: taskId });
        await Note.deleteMany({ task: taskId });

        await Project.updateOne(
            { tasks: taskId },
            { $pull: { tasks: taskId } }
        );
        next();
    } catch (err) {
        next(err);
    }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;