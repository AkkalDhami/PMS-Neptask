import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        maxlength: 1000,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    mentions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    reactions: [{
        emoji: String,
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
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
}, { timestamps: true });

commentSchema.index({ task: 1, author: 1 }, { unique: true });

export default mongoose.model('Comment', commentSchema);