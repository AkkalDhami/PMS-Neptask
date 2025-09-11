import mongoose from "mongoose";

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
                enum: ["owner", "admin", "member", 'viewer', 'guest'],
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
    }]
}, { timestamps: true });

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;