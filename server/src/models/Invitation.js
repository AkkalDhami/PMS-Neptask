import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'viewer', 'manager', 'guest'],
        default: 'member',
        lowercase: true
    },
    invitedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    acceptedAt: { type: Date },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rejectedAt: { type: Date },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'expired', 'revoked'],
        default: 'pending'
    },
    expiresAt: {
        type: Date,
        required: true
    },
    meta: {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },
    },
}, {
    timestamps: true
});


invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;