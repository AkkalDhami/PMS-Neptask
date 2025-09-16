
import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { sendOverdueEmail } from '../controllers/taskController.js';

cron.schedule("* * * * *", async () => {
    console.log("⏳ Running overdue task reminder job...");
    try {
        const now = new Date();

        const overdueTasks = await Task.find({
            dueDate: { $lt: now },
            status: { $ne: "completed" },
        }).populate("assignedTo", "name _id email")
            .populate("project", "name _id");

        for (const task of overdueTasks) {
            const user = await User.findById(task.assignedTo);
            if (user) {
                await sendOverdueEmail(user, task);
                console.log(`📧 Sent reminder to ${user.email} for task: ${task.title}`);
            }
        }
    } catch (err) {
        console.error("❌ Error in cron job:", err);
    }
});

export default cron;