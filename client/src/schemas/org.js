import * as z from "zod";
import { emailSchema } from "./auth";

export const orgSchema = z.object({
    name: z.string().min(2, "Organization name is required"),
    orgEmail: emailSchema,
    logo: z.any().optional(),
});

export const updateOrgSchema = z.object({
    name: z.string().min(2, "Organization name is required"),
    logo: z.any().optional(),
});

