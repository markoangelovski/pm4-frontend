import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { Project, ProjectFromServer, Response, User } from "@/types";
import { ProjectFormData } from "@/components/pm/projects/project-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./use-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const projectsPath = process.env.NEXT_PUBLIC_PROJECTS_PATH;

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<Response<Project>> =>
      fetchWithAuth(`${backendUrl}${projectsPath}`),
    retry: false,
  });
};

export const useProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: (): Promise<Response<ProjectFromServer>> =>
      fetchWithAuth(`${backendUrl}${projectsPath}/${projectId}`),
    retry: false,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData: ProjectFormData) =>
      fetchWithAuth(`${backendUrl}${projectsPath}`, {
        method: "POST",
        body: projectData,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["projects"],
        (oldData: Response<Project> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: [...oldData.results, data.results[0]],
              }
            : data;
        }
      );
    },
  });
};

export const useEditProjectMutation = () => {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectData: ProjectFormData) =>
      fetchWithAuth(`${backendUrl}${projectsPath}/${projectId}`, {
        method: "PATCH",
        body: projectData,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["projects"],
        (oldData: Response<ProjectFromServer> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((p) =>
                  p.id === data.results[0].id ? data.results[0] : p
                ),
              }
            : data;
        }
      );
      queryClient.setQueryData(["project", projectId], data);
    },
  });
};

export const useDeleteProjectMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      fetchWithAuth(`${backendUrl}${projectsPath}/${projectId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData(
        ["projects"],
        (oldData: Response<ProjectFromServer> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.filter((p) => p.id !== projectId),
              }
            : oldData;
        }
      );
      queryClient.removeQueries({ queryKey: ["project", projectId] });
      router.push("/projects");
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};
