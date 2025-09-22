import mongoose from "mongoose";
import Task from "./Task.js";

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


subTaskSchema.index({ task: 1, title: 1 }, { unique: true });

subTaskSchema.post('save', async function (doc, next) {
    try {
        await Task.updateOne(
            { _id: doc.task },
            { $addToSet: { subtasks: doc._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

subTaskSchema.pre('findOneAndDelete', async function (next) {
    try {
        const subtaskId = this.getQuery()._id;
        if (!subtaskId) return next();

        await Task.updateOne(
            { subtasks: subtaskId },
            { $pull: { subtasks: subtaskId } }
        );

        next();
    } catch (error) {
        next(error);
    }
});

const Subtask = mongoose.model("Subtask", subTaskSchema);

export default Subtask;