const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: [
        { type: String } // e.g. ["create_project", "edit_task", "delete_member"]
    ],
    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
}, { timestamps: true });
