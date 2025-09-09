import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["owner", "admin", "editor", "viewer"],
                default: "viewer"
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending", "in-progress", "review", "completed"],
        default: "pending"
    },
    startDate: Date,
    dueDate: Date,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;