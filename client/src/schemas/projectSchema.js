
import { z } from "zod";

export const projectFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters" })
        .max(100, { message: "Name cannot exceed 100 characters" }),
    description: z
        .string()
        .max(500, { message: "Description cannot exceed 500 characters" })
        .optional()
        .or(z.literal("")),
    status: z.enum(
        [
            "planning",
            "pending",
            "in-progress",
            "review",
            "completed",
            "on-hold",
            "cancelled",
        ],
    ),
    priority: z.enum(["low", "medium", "high", "urgent"]),

    startDate: z.date({
        required_error: "Start date is required",
        invalid_type_error: "Invalid date format",
    }),

    dueDate: z.date({
        required_error: "Due date is required",
        invalid_type_error: "Invalid date format",
    }),

    tags: z.array(z.string().trim()).optional(),
    isActive: z.boolean().default(true),
}).refine((data) => data.dueDate >= data.startDate, {
    message: "Due date must be after start date",
    path: ["dueDate"],
});