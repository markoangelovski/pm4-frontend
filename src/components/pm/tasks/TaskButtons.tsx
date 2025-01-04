"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./TaskFrom";
import { Project, Task } from "@/types";
import { useCreateTaskMutation, useEditTaskMutation } from "@/hooks/use-tasks";

interface TaskButtonsProps {
  projectId: string;
  task?: Task;
  // onSubmit: (data: Task) => Promise<void>;
}

export function TaskButtons({
  projectId,
  task /* , onSubmit */,
}: TaskButtonsProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { toast } = useToast();

  const { mutate: createTaskCall } = useCreateTaskMutation();
  const { mutate: editTaskCall } = useEditTaskMutation();

  const handleSubmit = (data: Task) => {
    // Here you would typically send the form data to your backend
    console.log(task ? "Editing task:" : "Creating new task:", data);

    if (task) {
      // Edit task
      editTaskCall(data, {
        onSuccess: (response) => {
          // Handle successful task edit
          console.log("Task updated:", response);
          setIsFormVisible(false);
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

  if (!isFormVisible) {
    return (
      <Button onClick={() => setIsFormVisible(true)}>
        {task ? (
          <>
            <Edit className="mr-2 h-4 w-4" /> Edit Task
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </>
        )}
      </Button>
    );
  }

  return (
    <TaskForm
      projectId={projectId}
      task={task}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}
