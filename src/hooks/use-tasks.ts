import {
  ApiResponse,
  Project,
  Task,
  TaskStatus,
  UUID,
  Note,
  Day,
  PmEvent,
  Log,
  Booking,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/utils";
import { taskSchema } from "@/schemas";
import { TaskFormData } from "@/components/pm/Tasks/TaskSortNew/NewTaskBtn";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const backendUrl1 = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL1;
const tasksPath = process.env.NEXT_PUBLIC_TASKS_PATH;
const taskPath = process.env.NEXT_PUBLIC_TASK_PATH;

export const useGetTask = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: (): Promise<ApiResponse<Task>> =>
      fetchWithAuth(`${backendUrl1}${tasksPath}/${taskId}`),
  });
};

export const useGetTasks = (projectId?: string, status?: string) => {
  const url = new URL(`${backendUrl1}${tasksPath}`);
  if (projectId) url.searchParams.append("projectId", projectId);
  if (status) url.searchParams.append("status", status);

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<ApiResponse<Task>> => {
      return fetchWithAuth(url.toString());
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task): Promise<ApiResponse<Task>> => {
      return fetchWithAuth(`${backendUrl1}${tasksPath}`, {
        method: "POST",
        body: task,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["tasks"],
        (oldData: ApiResponse<Task> | undefined) => {
          return oldData
            ? { ...oldData, data: [...oldData.data, data.data[0]] }
            : data;
        }
      );
    },
  });
};

export const useEditTask = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task): Promise<ApiResponse<Task>> => {
      return fetchWithAuth(`${backendUrl1}${tasksPath}/${taskId}`, {
        method: "PATCH",
        body: task,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["tasks"],
        (oldData: ApiResponse<Task> | undefined) => {
          return oldData
            ? {
                ...oldData,
                data: oldData.data.map((p) =>
                  p.id === data.data[0].id ? data.data[0] : p
                ),
              }
            : data;
        }
      );
      queryClient.setQueryData(["task", taskId], data);
    },
  });
};

export const useDeleteTask = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<ApiResponse<Task>> => {
      return fetchWithAuth(`${backendUrl1}${tasksPath}/${taskId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["tasks"],
        (oldData: ApiResponse<Task> | undefined) => {
          return oldData
            ? {
                ...oldData,
                data: oldData.data.filter((p) => p.id !== taskId),
              }
            : oldData;
        }
      );
      queryClient.removeQueries({ queryKey: ["task", taskId] });
    },
  });
};
