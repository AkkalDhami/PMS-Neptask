import mongoose from "mongoose";
import Workspace from "./Workspace.js";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    logo: {
        url: String,
        public_id: String,
    },
    orgEmail: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
                enum: ["owner", "manager", "admin", "member", 'viewer'],
                default: "member"
            },
            joinedAt: { type: Date, default: Date.now }
        }
    ],
    subscription: {
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free"
        },
        stripeCustomerId: String,
        renewalDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    workspaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspace"
    }],
    isDeleted: {
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
    }
}, { timestamps: true });

organizationSchema.index({ scheduledDeletionAt: 1 }, { expireAfterSeconds: 0 });

// Middleware to exclude deleted organizations from queries
// organizationSchema.pre(/^find/, function (next) {
//     if (this.getFilter().isDeleted === undefined) {
//         this.where({ isDeleted: false });
//     }
//     next();
// });

organizationSchema.pre("findOneAndDelete", async function (next) {
    const orgId = this.getQuery()._id;
    if (!orgId) return next();

    await Workspace.deleteMany({ organization: orgId });

    next();
});

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;