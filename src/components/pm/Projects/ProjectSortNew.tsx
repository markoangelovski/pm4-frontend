import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Search } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { CardDescription, CardHeader } from "@/components/ui/card";
import { Project } from "@/types";
import { projectSchema } from "@/schemas/projects.schemas";
import { useCreateProject, useGetProjects } from "@/hooks/use-projects";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useUpdateQueryParam } from "@/hooks/use-helpers";
import { toast } from "@/hooks/use-toast";

type NewProjectFormData = z.infer<typeof projectSchema>;

const ProjectSortNew = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const updateQueryParam = useUpdateQueryParam();

  const { mutate: createProject, isPending, error } = useCreateProject();

  useEffect(() => {
    // Display error message if present
    error &&
      toast({
        title: error?.name || "Error creating project",
        description: error?.message,
        variant: "destructive",
      });
  }, []);

  const form = useForm<NewProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      pl: "",
    },
  });

  const handleNewProject = (data: NewProjectFormData) => {
    createProject(data, {
      onSuccess: () => {
        form.reset();
        setIsNewProjectOpen(false);
      },
    });
  };

  return (
    <CardHeader>
      <CardDescription>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-1/2 flex items-center">
            <div className="flex items-center border border-gray-200 px-2 py-1 rounded-md">
              <Search className="text-gray-400" />
              <Input
                type="text"
                placeholder="Filter projects"
                className=" w-full border-none"
                value={searchParams.get("q") || ""}
                onChange={(e) => router.push(`?q=${e.target.value}`)}
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
                  onSelect={() => updateQueryParam("sort", "oldest")}
                >
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => updateQueryParam("sort", "updated")}
                >
                  Last Updated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
              <DialogTrigger asChild>
                <Button>New</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleNewProject)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                        onClick={() => setIsNewProjectOpen(false)}
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
          </div>
        </div>
      </CardDescription>
    </CardHeader>
  );
};

export default ProjectSortNew;
