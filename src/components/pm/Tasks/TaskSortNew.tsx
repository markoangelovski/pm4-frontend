import { useState, useEffect, Fragment } from "react";
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { randomUUID } from "crypto";
import { Task, TaskStatus } from "@/types";
import { useUpdateQueryParam } from "@/hooks/use-helpers";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  pl: z.string().min(1, "Program lead is required"),
  jiraLink: z.string().url("Invalid Jira link"),
  dueDate: z.date(),
  status: z.enum(["upcoming", "in-progress", "done"])
});

type TaskFormData = z.infer<typeof taskSchema>;

const TaskSortNew = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = useUpdateQueryParam();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const taskStatus = searchParams.get("status");
  useEffect(() => {
    console.log("tasks status: ", !taskStatus, taskStatus);
    if (!taskStatus) {
      // const params = new URLSearchParams(searchParams);
      // params.append("status", "in-progress");
      // router.push(`${pathName}?${params}`);
      // updateQueryParam("status", "in-progress");
      updateQueryParam("status", "in-progress");
    }
  }, [router, pathName, searchParams, taskStatus]);

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      pl: "",
      jiraLink: "",
      dueDate: new Date(),
      status: "upcoming"
    }
  });

  const handleNewTask = (data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: randomUUID(),
      projectId: "default-project-id",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    // setTasks([...tasks, newTask]);
    setIsNewTaskOpen(false);
    taskForm.reset();
  };

  const handleStatusToggle = (status: TaskStatus) => {
    const currentStatus = searchParams.get("status");
    let newStatus: string[];

    if (currentStatus) {
      newStatus = currentStatus.split(",");
      const index = newStatus.indexOf(status);
      if (index > -1) {
        newStatus.splice(index, 1);
      } else {
        newStatus.push(status);
      }
    } else {
      newStatus = [status];
    }

    if (newStatus.length > 0) {
      // updateQueryParams({ status: newStatus.join(",") });
      updateQueryParam("status", newStatus.join(","));
    } else {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("status");
      router.push(`?${newParams.toString()}`);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2 flex items-center">
          <div className="flex items-center border border-gray-200 px-2 py-1 rounded-md w-full">
            <Search className="text-gray-400" />
            <Input
              type="text"
              placeholder="Find task"
              className="w-full border-none"
              value={searchParams.get("q") || ""}
              onChange={(e) => updateQueryParam("q", e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "title")}
              >
                By Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "newest")}
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "updated")}
              >
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "due-date")}
              >
                By Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => updateQueryParam("sort", "pl")}>
                By Program Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                                  format(new Date(field.value), "PPP")
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
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date ? date : undefined)
                              }
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
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
                            <SelectItem value="Upcoming">Upcoming</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Done">Done</SelectItem>
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
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="upcoming"
            checked={searchParams.get("status")?.includes("upcoming") || false}
            onCheckedChange={() => handleStatusToggle("upcoming")}
            className="scale-75"
          />
          <label htmlFor="upcoming" className="text-sm cursor-pointer">
            Upcoming
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="in-progress"
            defaultChecked={true}
            checked={
              searchParams.get("status")?.includes("in-progress") || false
            }
            onCheckedChange={() => handleStatusToggle("in-progress")}
            className="scale-75"
          />
          <label htmlFor="in-progress" className="text-sm cursor-pointer">
            In Progress
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="done"
            checked={searchParams.get("status")?.includes("done") || false}
            onCheckedChange={() => handleStatusToggle("done")}
            className="scale-75"
          />
          <label htmlFor="done" className="text-sm cursor-pointer">
            Done
          </label>
        </div>
      </div>
    </>
  );
};

export default TaskSortNew;
