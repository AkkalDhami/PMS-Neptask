import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project", required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
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
        enum: ["pending", "in-progress", "review", "completed"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
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
    dueDate: Date,
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            message: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    attachments: [String],
    tags: [String],

}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
export default Task;