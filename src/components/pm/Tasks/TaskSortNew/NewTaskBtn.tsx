import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { randomUUID } from "crypto";
import { Task, TaskStatus } from "@/types";
import { useUpdateQueryParam } from "@/hooks/use-helpers";
import { useCreateTask } from "@/hooks/use-tasks";
import { toast } from "@/hooks/use-toast";
import { useGetProjects } from "@/hooks/use-projects";
import ProjectNameField from "./ProjectField";

const taskSchema = z.object({
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

export type TaskFormData = z.infer<typeof taskSchema>;

const NewTaskBtn = () => {
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");

  const {
    data: projectsData,
    isLoading,
    error: getProjectsEerror,
  } = useGetProjects();

  const project = projectsData?.data?.find((p) => p.id === projectId);

  const {
    mutate: createTask,
    isPending,
    error: createTaskError,
  } = useCreateTask();
  const router = useRouter();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (project) {
      taskForm.reset({
        title: "",
        projectId: projectId || "",
        description: "",
        pl: project.pl || "",
        jiraLink: "",
        dueDate: format(new Date(), "yyyy-MM-dd"),
        status: "upcoming",
      });
    }
  }, [project, taskForm]);

  const handleNewTask = async (data: TaskFormData) => {
    const finalProjectId = projectId || (project ? project.id : "");
    if (!finalProjectId) {
      throw new Error("Project ID is missing");
    }
    const finalData = {
      ...data,
      projectId: finalProjectId,
      dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
    };
    console.log("Task data: ", finalData);

    createTask(finalData, {
      onSuccess: () => {
        setIsNewTaskOpen(false);
        taskForm.reset();
        toast({
          title: "Task created successfully!",
          description: "Your new task has been added.",
          // variant: "success",
        });
      },
      onError: (err) => {
        toast({
          title: "Error creating task",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  useEffect(() => {
    if (createTaskError) {
      toast({
        title: "Error creating task",
        description: createTaskError.message,
        variant: "destructive",
      });
    }
  }, [createTaskError]);

  return (
    <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
      <DialogTrigger asChild>
        <Button>New Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <Form {...taskForm}>
          <form
            onSubmit={taskForm.handleSubmit(handleNewTask)}
            className="space-y-4"
          >
            <ProjectNameField taskForm={taskForm} project={project} />
            <FormField
              control={taskForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="pl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program Lead</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="jiraLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jira Link</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(parseISO(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? parseISO(field.value) : undefined
                        }
                        onSelect={(date) => {
                          field.onChange(
                            date ? format(date, "yyyy-MM-dd") : ""
                          );
                        }}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={taskForm.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewTaskOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTaskBtn;
