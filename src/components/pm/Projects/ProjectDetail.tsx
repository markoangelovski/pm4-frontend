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
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/pm/Header/Header";
import TasksList from "@/components/pm/Tasks/TasksList";
import { Note, Project, Task } from "@/types";
import { projectSchema } from "@/schemas/projects.schemas";
import { useGetProject } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import TaskList2 from "@/components/pm/Tasks/TaskList2";

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const { isLoading, error, data } = useGetProject(projectId || "");

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);

  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: data?.data?.[0] || {}
  });

  const handleEditProject = (data: ProjectFormData) => {
    // setProject({ ...project, ...data });
    setIsEditProjectOpen(false);
  };

  const handleDeleteProject = () => {
    // In a real application, you would delete the project here
    alert("Project deleted");
    setIsDeleteProjectOpen(false);
  };

  // Display error using toast notification
  useEffect(() => {
    if (error || data?.hasErrors) {
      toast({
        title: error?.name || "Error loading projects",
        description: error?.message || data?.message,
        variant: "destructive"
      });
    }
  }, [error, data]);

  return (
    <>
      <Header breadcrumbs={["Projects", data?.data?.[0]?.title || ""]} />
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

        {!isLoading && !data?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>Project not found.</CardTitle>
            </CardHeader>
          </Card>
        )}

        {data?.data?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>{data?.data[0].title}</CardTitle>
              <CardDescription>Project Details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Description:</strong> {data?.data[0].description}
                </p>
                <p>
                  <strong>Program Lead:</strong> {data?.data[0].pl}
                </p>
                <div className="mt-2">
                  <p>
                    <strong>Task Counts:</strong>
                  </p>
                  <ul className="list-disc list-inside">
                    <li>Upcoming: {data?.data[0].upcomingTasks}</li>
                    <li>In Progress: {data?.data[0].inProgressTasks}</li>
                    <li>Done: {data?.data[0].doneTasks}</li>
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
                  <Button type="submit">Submit</Button>
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
              <Button variant="destructive" onClick={handleDeleteProject}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
