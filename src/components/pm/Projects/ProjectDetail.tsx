"use client";

import { useState, useEffect, Fragment } from "react";
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
import TasksList from "@/components/pm/Tasks/TasksList";
import { Note, Project, Task } from "@/types";
import { projectSchema } from "@/schemas/projects.schemas";
import {
  useGetProject,
  useEditProject,
  useDeleteProject,
} from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import TaskList2 from "@/components/pm/Tasks/TaskList2";

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const {
    data: project,
    isLoading,
    error: projectError,
  } = useGetProject(projectId || "");

  const {
    mutate: editProject,
    isPending: isEditPending,
    error: editProjectError,
  } = useEditProject(projectId || "");

  const {
    mutate: deleteProject,
    isPending: isDeletePending,
    error: deleteProjectError,
  } = useDeleteProject(projectId || "");

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {}, // Initialize with an empty object
  });

  useEffect(() => {
    if (project?.data?.[0]) {
      projectForm.reset(project.data[0]); // Set initial values for Edit Project form from the project
    }
  }, [project, projectForm]);

  const handleEditProject = (data: ProjectFormData) => {
    editProject(data, {
      onSuccess: () => {
        setIsEditProjectOpen(false);
      },
    });
  };

  const handleDeleteProject = () => {
    deleteProject();
    router.push("/projects");
  };

  // Display error using toast notification
  useEffect(() => {
    if (projectError || editProjectError || project?.hasErrors) {
      toast({
        title:
          projectError?.name ||
          editProjectError?.name ||
          deleteProjectError?.name ||
          "Error loading projects",
        description:
          projectError?.message ||
          editProjectError?.message ||
          deleteProjectError?.message ||
          project?.message,
        variant: "destructive",
      });
    }
  }, [project, projectError, editProjectError, deleteProjectError]);

  return (
    <>
      <Header breadcrumbs={["Projects", project?.data?.[0]?.title || ""]} />
      <div className="container mx-auto p-4 space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/projects")}
          className=""
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isLoading && <Skeleton className="h-60 w-full" />}

        {!isLoading && !project?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>Project not found.</CardTitle>
            </CardHeader>
          </Card>
        )}

        {project?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>{project?.data[0].title}</CardTitle>
              <CardDescription>Project Details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Description:</strong> {project?.data[0].description}
                </p>
                <p>
                  <strong>Program Lead:</strong> {project?.data[0].pl}
                </p>
                <div className="mt-2">
                  <p>
                    <strong>Task Counts:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Upcoming: {project?.data[0].upcomingTasks}</li>
                    <li>In Progress: {project?.data[0].inProgressTasks}</li>
                    <li>Done: {project?.data[0].doneTasks}</li>
                  </ul>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={() => setIsEditProjectOpen(true)}>
                    Edit Project
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteProjectOpen(true)}
                  >
                    Delete Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <TaskList2 />

        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <Form {...projectForm}>
              <form
                onSubmit={projectForm.handleSubmit(handleEditProject)}
                className="space-y-4"
              >
                <FormField
                  control={projectForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={projectForm.control}
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
                  control={projectForm.control}
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
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditProjectOpen(false)}
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

        <Dialog
          open={isDeleteProjectOpen}
          onOpenChange={setIsDeleteProjectOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
            </DialogHeader>
            <p>
              This action cannot be undone. This will permanently delete the
              project and all associated tasks.
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteProjectOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={isDeletePending}
                onClick={handleDeleteProject}
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
