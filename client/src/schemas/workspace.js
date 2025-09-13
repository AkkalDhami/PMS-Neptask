import { z } from "zod";

export const workspaceSchema = z.object({
    name: z.string().trim().min(3, "Workspace name must be at least 3 characters."),
    description: z.string().trim().optional(),
    color: z.string().trim().optional(),
    isActive: z.boolean().default(true),
});

export const workspaceSchema2 = z.object({
    name: z.string().trim().min(3, "Workspace name must be at least 3 characters."),
    description: z.string().trim().optional(),
    color: z.string().trim().optional(),
    isActive: z.boolean().default(true),
    admin: z.string().trim().optional(),
    organization: z.string().trim().min(1, "Select an organization."),
});
