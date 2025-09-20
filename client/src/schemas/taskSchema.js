import { z } from "zod";

export const taskFormSchema = z.object({
    project: z.string().min(1, "Project is required"),
    title: z.string().min(1, "Title is required").max(100, "Title too long"),
    description: z.string().optional(),
    assignedTo: z.string().min(1, "Assignee is required"),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    startDate: z.date({
        required_error: "Start date is required",
    }),
    status: z.enum(["pending", "in-progress", "completed"]),
    dueDate: z.date({
        required_error: "Due date is required",
    }),
}).refine((data) => data.dueDate > data.startDate, {
    path: ["dueDate"],
    message: "Due date must be after start date",
});
