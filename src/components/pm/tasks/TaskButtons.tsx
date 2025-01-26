"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./TaskFrom";
import { Task } from "@/types";
import { useCreateTaskMutation, useEditTaskMutation } from "@/hooks/use-tasks";

interface TaskButtonsProps {
  projectId: string;
  task?: Task;
}

export function TaskButtons({ projectId, task }: TaskButtonsProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { toast } = useToast();

  const { mutate: createTaskCall } = useCreateTaskMutation();
  const { mutate: editTaskCall } = useEditTaskMutation();

  const handleSubmit = (data: Task) => {
    // Here you would typically send the form data to your backend
    console.log(task ? "Editing task:" : "Creating new task:", data);

    if (isEditing) {
      // Edit task
      editTaskCall(data, {
        onSuccess: (response) => {
          // Handle successful task edit
          console.log("Task updated:", response);
          setIsFormVisible(false);
          setIsEditing(false);
        },
        onError: (error) => {
          // Handle task editing error
          console.error("Task editing error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    } else {
      // Create new task
      createTaskCall(data, {
        onSuccess: (response) => {
          // Handle successful task creation
          console.log("Task created:", response);
          setIsFormVisible(false);
          setIsEditing(false);
        },
        onError: (error) => {
          // Handle task creation error
          console.error("Task creation error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  // if (!isFormVisible) {
  //   return (
  //     <Button onClick={() => setIsFormVisible(true)}>
  //       {task ? (
  //         <>
  //           <Edit className="mr-2 h-4 w-4" /> Edit Task
  //         </>
  //       ) : (
  //         <>
  //           <PlusCircle className="mr-2 h-4 w-4" /> New Task
  //         </>
  //       )}
  //     </Button>
  //   );
  // }

  // return (
  // <TaskForm
  //   projectId={projectId}
  //   task={task}
  //   onSubmit={handleSubmit}
  //   onCancel={handleCancel}
  // />
  // );

  return (
    <>
      {!task && (
        <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsEditing(false)}
              className="mb-6"
              title="Create new task"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            aria-description="Create new task"
          >
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              projectId={projectId}
              task={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      )}

      {task && (
        <Dialog open={isFormVisible} onOpenChange={setIsFormVisible}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="mb-6"
              title={"Edit task " + task.title}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              projectId={projectId}
              task={task}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
