import mongoose from "mongoose";
import Project from "./Project.js";
import Organization from "./Organization.js";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    color: {
        type: String,
        default: '#FF5733',
    },
    isActive: {
        type: Boolean,
        default: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["owner", "member", "admin", "viewer", "manager"],
                default: 'member'
            },
            joinedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    isParmanentlyDeleted: {
        type: Boolean,
        default: false
    },
    deletionRequestedAt: {
        type: Date,
        default: null
    },
    scheduledDeletionAt: {
        type: Date,
        default: null
    },
    deletionReason: {
        type: String,
        trim: true,
        maxlength: 500
    },
    deletionRequestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recoveredAt: {
        type: Date,
        default: null
    },
    recoveredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

workspaceSchema.pre("findOneAndDelete", async function (next) {
    const workspaceId = this.getQuery()._id;
    if (!workspaceId) return next();

    await Project.deleteMany({ workspace: workspaceId });

    await Organization.updateOne(
        { workspaces: workspaceId },
        { $pull: { workspaces: workspaceId } }
    );

    next();
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;