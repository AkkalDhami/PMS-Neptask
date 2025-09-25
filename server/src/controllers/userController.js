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
  if (!userId)
    return res.status(403).json({
      success: false,
      message: "User Id is required",
    });
  const tasks = await Task.find({ assignedTo: userId });
  res.status(200).json({
    success: true,
    tasks,
  });
});

//? CHANGE USER ROLE
export const changeUserRole = TryCatch(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  user.role = role;
  await user.save();
  res.status(200).json({
    success: true,
    message: "User role changed successfully",
  });
});

export const getUserOrgs = TryCatch(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("organizations");
  if (!user)
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  res.status(200).json({
    success: true,
    organizations: user.organizations,
  });
});
