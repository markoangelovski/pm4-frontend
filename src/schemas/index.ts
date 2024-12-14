import { parseISO } from "date-fns";
import * as z from "zod";

export const projectSchema = z.object({
  title: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  pl: z.string().min(1, "Program lead is required"),
});

export const taskSchema = z.object({
  projectId: z.string().optional(),
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  pl: z.string().optional(),
  jiraLink: z.string().optional(),
  dueDate: z.string().refine(
    (val) => {
      try {
        parseISO(val);
        return true;
      } catch (error) {
        return false;
      }
    },
    { message: "Invalid date format" }
  ),
  status: z.enum(["upcoming", "in-progress", "done"]),
});
