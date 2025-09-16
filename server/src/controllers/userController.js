import { TryCatch } from "../middlewares/tryCatch.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

//? GET ALL USERS
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

//? GET TASKS BY USER ID
export const getUserTasks = TryCatch(async (req, res) => {
    const { userId } = req.params;
    //     const userId = req.user?._id;
    if(!userId) return res.status(403).json({
        success: false,
        message: "User Id is required"
    })
    const tasks = await Task.find({ assignedTo: userId });
    res.status(200).json({
        success: true,
        tasks,
    });
});
