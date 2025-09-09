import mongoose from "mongoose";

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
    tags: [String],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            role: {
                type: String,
                enum: ["owner", "member", "admin", "viewer"],
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
    }]
}, { timestamps: true });

export default Workspace = mongoose.model("Workspace", workspaceSchema);