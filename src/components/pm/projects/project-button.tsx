"use client";

import { useState } from "react";
import { PlusCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProjectForm, ProjectFormData } from "./project-form";
import {
  useCreateProjectMutation,
  useEditProjectMutation,
} from "@/hooks/use-projects";
import { toast } from "@/hooks/use-toast";

interface ProjectButtonsProps {
  project?: ProjectFormData;
}

export default function ProjectButtons({ project }: ProjectButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: createProjectCall } = useCreateProjectMutation();
  const { mutate: editProjectCall } = useEditProjectMutation();

  function onSubmit(values: ProjectFormData) {
    // Here you would typically send the form data to your backend
    console.log(
      isEditing ? "Editing project:" : "Creating new project:",
      values
    );
    if (isEditing) {
      // Edit project
      editProjectCall(values, {
        onSuccess: (response) => {
          // Handle successful project creation
          console.log("Project edited:", response);
          setIsOpen(false);
          setIsEditing(false);
        },
        onError: (error) => {
          // Handle project editing error
          console.error("Project editing error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    } else {
      // Create new project
      createProjectCall(values, {
        onSuccess: (response) => {
          // Handle successful project creation
          console.log("Project created:", response);
          setIsOpen(false);
          setIsEditing(false);
        },
        onError: (error) => {
          // Handle project creation error
          console.error("Project creation error:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        },
      });
    }
  }

  return (
    <>
      {!project && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsEditing(false)}
              className="mb-6"
              title="Create new project"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            aria-description="Create new project"
          >
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      )}

      {project && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="mb-6"
              title={"Edit project " + project.title}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectForm initialData={project} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
