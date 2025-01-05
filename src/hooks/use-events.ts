import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import {
  PmEvent,
  Response,
  Task,
  TaskFromServer,
  TaskFromServerWithProject,
} from "@/types";
import { ProjectFormData } from "@/components/pm/projects/project-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "./use-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const eventsPath = process.env.NEXT_PUBLIC_EVENTS_PATH;

export const useEventsQuery = () => {
  const url = new URL(`${backendUrl}${eventsPath}`);
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  if (taskId) url.searchParams.append("taskId", taskId);
  if (day) url.searchParams.append("day", day);

  return useQuery({
    queryKey: ["events", { taskId, day }],
    queryFn: (): Promise<Response<PmEvent>> => fetchWithAuth(url.toString()),
    retry: false,
  });
};

interface CreateEventPayload {
  // TODO: makni ovo u types
  title: string;
  day: string;
  logTitle: string;
  duration: number;
  taskId?: string;
}

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: CreateEventPayload): Promise<Response<PmEvent>> =>
      fetchWithAuth(`${backendUrl}${eventsPath}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: [...oldData.results, data.results[0]],
                totalResults: oldData.totalResults + 1,
              }
            : data;
        }
      );
    },
  });
};

// onSuccess: (data) => {
//   queryClient.setQueryData(
//     ["tasks", taskDeps],
//     (oldData: Response<Task> | undefined) => {
//       return oldData
//         ? {
//             ...oldData,
//             results: [...oldData.results, data.results[0]],
//           }
//         : data;
//     }
//   );
// },

// export const useEditTaskMutation = () => {
//   const searchParams = useSearchParams();
//   const taskId = searchParams.get("taskId");

//   const taskDeps = {
//     projectId: searchParams.get("projectId"),
//     status: searchParams.get("status"),
//     limit: searchParams.get("limit"),
//     offset: searchParams.get("offset"),
//     pl: searchParams.get("pl"),
//     q: searchParams.get("q"),
//   };

//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (taskData: ProjectFormData) =>
//       fetchWithAuth(`${backendUrl}${tasksPath}/${taskId}`, {
//         method: "PATCH",
//         body: taskData,
//       }),
//     onSuccess: (data) => {
//       queryClient.setQueryData(
//         ["tasks", taskDeps],
//         (oldData: Response<TaskFromServer> | undefined) => {
//           return oldData
//             ? {
//                 ...oldData,
//                 results: oldData.results.map((p) =>
//                   p.id === data.results[0].id ? data.results[0] : p
//                 ),
//               }
//             : data;
//         }
//       );
//       queryClient.setQueryData(["task", taskId], data);
//     },
//   });
// };

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: async (eventId: string) =>
      fetchWithAuth(`${backendUrl}${eventsPath}/${eventId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.filter((p) => p.id !== variables),
              }
            : oldData;
        }
      );
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};
