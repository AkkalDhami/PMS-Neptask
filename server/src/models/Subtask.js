import mongoose from "mongoose";

const subTaskSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task", required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    completed: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


const Subtask = mongoose.model("Subtask", subTaskSchema);

export default Subtask;