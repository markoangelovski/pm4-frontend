import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import {
  Response,
  Task,
  TaskFromServer,
  TaskFromServerWithProject,
} from "@/types";
import { ProjectFormData } from "@/components/pm/projects/project-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./use-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const tasksPath = process.env.NEXT_PUBLIC_TASKS_PATH;

export const useTasksQuery = () => {
  const url = new URL(`${backendUrl}${tasksPath}`);
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const pl = searchParams.get("pl");
  const q = searchParams.get("q");

  if (projectId) url.searchParams.append("projectId", projectId);
  if (status) url.searchParams.append("status", status);
  if (limit) url.searchParams.append("limit", limit);
  if (offset) url.searchParams.append("offset", offset);
  if (pl) url.searchParams.append("pl", pl);
  if (q) url.searchParams.append("q", q);

  return useQuery({
    queryKey: ["tasks", { projectId, status, limit, offset, pl, q }],
    queryFn: (): Promise<Response<TaskFromServer>> =>
      fetchWithAuth(url.toString()),
    retry: false,
  });
};

export const useTaskQuery = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: (): Promise<Response<TaskFromServerWithProject>> =>
      fetchWithAuth(`${backendUrl}${tasksPath}/${taskId}`),
    retry: false,
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskDeps = {
    projectId: searchParams.get("projectId"),
    status: searchParams.get("status"),
    limit: searchParams.get("limit"),
    offset: searchParams.get("offset"),
    pl: searchParams.get("pl"),
    q: searchParams.get("q"),
  };

  return useMutation({
    mutationFn: async (taskData: Task) =>
      fetchWithAuth(`${backendUrl}${tasksPath}`, {
        method: "POST",
        body: taskData,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["tasks", taskDeps],
        (oldData: Response<Task> | undefined) => {
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

export const useEditTaskMutation = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const taskDeps = {
    projectId: searchParams.get("projectId"),
    status: searchParams.get("status"),
    limit: searchParams.get("limit"),
    offset: searchParams.get("offset"),
    pl: searchParams.get("pl"),
    q: searchParams.get("q"),
  };

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskData: ProjectFormData) =>
      fetchWithAuth(`${backendUrl}${tasksPath}/${taskId}`, {
        method: "PATCH",
        body: taskData,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["tasks", taskDeps],
        (oldData: Response<TaskFromServer> | undefined) => {
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
      queryClient.setQueryData(["task", taskId], data);
    },
  });
};

export const useDeleteTaskMutation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      fetchWithAuth(`${backendUrl}${tasksPath}/${taskId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.setQueryData(
        ["tasks"],
        (oldData: Response<TaskFromServer> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.filter((p) => p.id !== taskId),
              }
            : oldData;
        }
      );
      queryClient.removeQueries({ queryKey: ["task", taskId] });
      router.push("/tasks");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};
