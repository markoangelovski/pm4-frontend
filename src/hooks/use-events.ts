import { ApiResponse, PmEvent, Task } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const backendUrl1 = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL1;
const eventsPath = process.env.NEXT_PUBLIC_EVENTS_PATH;
const logsPath = process.env.NEXT_PUBLIC_EVENTS_PATH;

export const useGetEvents = () => {
  const searchParams = useSearchParams();

  const queryKey = ["events"];

  const day = searchParams.get("day");
  const taskId = searchParams.get("taskId");
  if (day) queryKey.push(day);
  if (taskId) queryKey.push(taskId);

  const url = new URL(`${backendUrl1}${eventsPath}`);

  if (day) url.searchParams.append("day", day);
  if (taskId) url.searchParams.append("taskId", taskId);

  return useQuery({
    queryKey,
    queryFn: (): Promise<ApiResponse<PmEvent>> => fetchWithAuth(url.toString()),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const queryKey = ["events"];

  const day = searchParams.get("day");
  const taskId = searchParams.get("taskId");
  if (day) queryKey.push(day);
  if (taskId) queryKey.push(taskId);

  return useMutation({
    mutationFn: async (event: PmEvent): Promise<ApiResponse<PmEvent>> => {
      return fetchWithAuth(`${backendUrl1}${eventsPath}`, {
        method: "POST",
        body: event,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: ApiResponse<Task> | undefined) => {
          return oldData
            ? { ...oldData, data: [...oldData.data, data.data[0]] }
            : data;
        }
      );
    },
  });
};

export const useDeleteEvent = (eventId: string) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const queryKey = ["events"];

  const day = searchParams.get("day");
  const taskId = searchParams.get("taskId");
  if (day) queryKey.push(day);
  if (taskId) queryKey.push(taskId);

  return useMutation({
    mutationFn: async (): Promise<ApiResponse<Task>> => {
      return fetchWithAuth(`${backendUrl1}${eventsPath}/${eventId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(
        queryKey,
        (oldData: ApiResponse<Task> | undefined) => {
          return oldData
            ? {
                ...oldData,
                data: oldData.data.filter((p) => p.id !== eventId),
              }
            : oldData;
        }
      );
      // queryClient.removeQueries({ queryKey: ["task", taskId] });
    },
  });
};
