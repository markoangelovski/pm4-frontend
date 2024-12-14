"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/pm/Header/Header";
import { Note, Project, Task } from "@/types";
import { projectSchema, taskSchema } from "@/schemas";
import {
  useGetProject,
  useEditProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import TaskList2 from "@/components/pm/Tasks/TaskList2";
import { useDeleteTask, useEditTask, useGetTask } from "@/hooks/use-tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const { data: task, isLoading, error: taskError } = useGetTask(taskId || "");

  const {
    mutate: editTask,
    isPending: isEditPending,
    error: editTaskError,
  } = useEditTask(taskId || "");

  const {
    mutate: deleteTask,
    isPending: isDeletePending,
    error: deleteTaskError,
  } = useDeleteTask(taskId || "");

  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {}, // Initialize with an empty object
  });

  useEffect(() => {
    if (task?.data?.[0]) {
      const taskData = task.data[0];
      taskForm.reset({
        ...taskData,
        dueDate: taskData.dueDate ? format(taskData.dueDate, "yyyy-MM-dd") : "",
      });
    }
  }, [task, taskForm]);

  const handleEditTask = (data: TaskFormData) => {
    const updatedData = { ...data, dueDate: new Date(data.dueDate) };
    editTask(updatedData, {
      onSuccess: () => {
        setIsEditTaskOpen(false);
        console.log("Edit Task successful!"); // Added success message
      },
      onError: (error) => {
        console.error("Edit Task error:", error); // Added error handling
      },
    });
  };

  const handleDeleteTask = () => {
    deleteTask();
    router.push("/tasks");
  };

  // Display error using toast notification
  useEffect(() => {
    if (taskError || editTaskError || task?.hasErrors) {
      toast({
        title:
          taskError?.name ||
          editTaskError?.name ||
          deleteTaskError?.name ||
          "Error loading tasks",
        description:
          taskError?.message ||
          editTaskError?.message ||
          deleteTaskError?.message ||
          task?.message,
        variant: "destructive",
      });
    }
  }, [task, taskError, editTaskError, deleteTaskError]);

  return (
    <>
      <Header breadcrumbs={["Projects", task?.data?.[0]?.title || ""]} />
      <div className="container mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/tasks")}
          className=""
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isLoading && <Skeleton className="h-60 w-full" />}

        {!isLoading && !task?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>Task not found.</CardTitle>
            </CardHeader>
          </Card>
        )}

        {task?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>{task?.data[0].title}</CardTitle>
              <CardDescription>Task Details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Description:</strong> {task?.data[0].description}
                </p>
                <p>
                  <strong>Program Lead:</strong> {task?.data[0].pl}
                </p>
                <p>
                  <strong>Jira Link:</strong> {task?.data[0].jiraLink}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {task?.data[0]?.dueDate
                    ? format(task?.data[0]?.dueDate, "PPP")
                    : "No due date"}
                </p>
                <p>
                  <strong>Status:</strong> {task?.data[0]?.status}
                </p>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={() => setIsEditTaskOpen(true)}>
                    Edit Task
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteTaskOpen(true)}
                  >
                    Delete Task
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task "{task?.data[0].title}"</DialogTitle>
            </DialogHeader>
            <Form {...taskForm}>
              <form
                onSubmit={taskForm.handleSubmit(handleEditTask)}
                className="space-y-4"
              >
                {/* <ProjectNameField taskForm={taskForm} /> */}
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
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
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
                    onClick={() => setIsEditTaskOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isEditPending}>
                    {isEditPending ? "Saving..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteTaskOpen} onOpenChange={setIsDeleteTaskOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
            </DialogHeader>
            <p>
              This action cannot be undone. This will permanently delete the
              task and all associated items.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteTaskOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletePending}
                onClick={handleDeleteTask}
              >
                {isDeletePending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
