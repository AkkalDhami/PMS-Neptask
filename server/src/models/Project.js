import mongoose from "mongoose";
import Task from "./Task.js";
import Workspace from "./Workspace.js";

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lockedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        lockedAt: {
            type: Date,
            default: null
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                role: {
                    type: String,
                    enum: ["owner", "admin", "manager", "member", "viewer"],
                    default: "viewer",
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],

        status: {
            type: String,
            enum: [
                "planning",
                "pending",
                "in-progress",
                "review",
                "completed",
                "on-hold",
                "cancelled",
            ],
            default: "planning",
            index: true,
        },

        startDate: {
            type: Date,
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },

        tasks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
    },
    { timestamps: true }
);

projectSchema.pre("findOneAndDelete", async function (next) {
    try {
        const projectId = this.getQuery()._id;
        if (!projectId) return next();

        await Task.deleteMany({ project: projectId });

        await Workspace.updateOne(
            { projects: projectId },
            { $pull: { projects: projectId } }
        );

        next();
    } catch (err) {
        next(err);
    }
});


projectSchema.post("save", async function (doc, next) {
    try {
        if (doc.workspace) {
            await Workspace.findByIdAndUpdate(doc.workspace, {
                $addToSet: { projects: doc._id },
            });
        }
        next();
    } catch (err) {
        next(err);
    }
});

projectSchema.methods.calculateProgress = async function () {
    try {
        const tasks = await Task.find({ project: this._id });

        if (tasks.length === 0) {
            this.progress = 0;
            return this.save();
        }

        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        this.progress = Math.round((completedTasks / tasks.length) * 100);

        return this.save();
    } catch (error) {
        throw new Error("Error calculating progress: " + error.message);
    }
};

const Project = mongoose.model("Project", projectSchema);

export default Project;