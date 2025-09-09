const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["task_assigned", "project_invite", "comment", "system"] },
    message: { type: String, required: true },
    link: { type: String }, // deep link to task/project
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
