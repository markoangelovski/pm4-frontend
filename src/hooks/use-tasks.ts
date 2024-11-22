import { ApiResponse, Project, Task } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const tasksPath = process.env.NEXT_PUBLIC_TASKS_PATH;
const taskPath = process.env.NEXT_PUBLIC_TASK_PATH;

export const useGetTasks = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const projectId = searchParams.get("projectId");

  const url = new URL(`${backendUrl}${tasksPath}`);
  if (status) url.searchParams.append("status", status);
  if (projectId) url.searchParams.append("projectId", projectId);

  return useQuery({
    queryKey: ["tasks", status, projectId],
    queryFn: (): Promise<ApiResponse<Task[]>> =>
      fetch(url.toString()).then((res) => res.json())
  });
};

export const useGetTask = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: (): Promise<ApiResponse<Task[]>> =>
      fetch(`${backendUrl}${taskPath}?id=${taskId}`).then((res) => res.json())
  });
};
