import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
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
    description: {
        type: String,
        trim: true,
        maxlength: 6000
    }
}, { timestamps: true });


const Note = mongoose.model("Note", noteSchema);

export default Note;