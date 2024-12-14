import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "./NewTaskBtn";
import { useGetProjects } from "@/hooks/use-projects";
import { Project } from "@/types";

const ProjectNameField = ({
  taskForm,
  project,
}: {
  taskForm: UseFormReturn<TaskFormData>;
  project: Project | undefined;
}) => {
  return (
    <FormField
      control={taskForm.control}
      name="projectId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel htmlFor="project">Project</FormLabel>
          <div className="flex flex-col">
            <Input type="hidden" {...field} value={project?.id || ""} />
            {project && <Input disabled className="" value={project.title} />}
            {!project && (
              <span className=" text-red-500">Project not found</span>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProjectNameField;
