import { TryCatch } from "../middlewares/tryCatch.js";
import User from "../models/User.js";

//? GET ALL USERS
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});