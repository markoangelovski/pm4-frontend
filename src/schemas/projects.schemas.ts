import * as z from "zod";

// Zod schema for new project form
export const projectSchema = z.object({
  title: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  pl: z.string().min(1, "Program lead is required")
});
