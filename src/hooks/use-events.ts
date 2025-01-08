import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import {
  Log,
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
const logsPath = process.env.NEXT_PUBLIC_LOGS_PATH;

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
  day?: string;
  logTitle?: string;
  duration?: number;
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

interface EditEventPayload extends CreateEventPayload {
  id: string;
}

export const useEditEventMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: EditEventPayload): Promise<Response<PmEvent>> =>
      fetchWithAuth(`${backendUrl}${eventsPath}/${payload.id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((event) =>
                  event.id === data.results[0].id
                    ? { ...event, ...data.results[0] }
                    : event
                ),
              }
            : data;
        }
      );
    },
  });
};

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

// TODO: prebaci ovo u types
interface CreateLogPayload {
  title: string;
  duration: number;
  eventId: string;
}

export const useCreateLogMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: CreateLogPayload): Promise<Response<Log>> =>
      fetchWithAuth(`${backendUrl}${logsPath}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              results: oldData.results.map((event) =>
                event.id === variables.eventId
                  ? { ...event, logs: [...event.logs, data.results[0]] }
                  : event
              ),
            };
          }
          return oldData;
        }
      );
    },
  });
};

interface EditLogPayload {
  id: string;
  title?: string;
  duration?: number;
  eventId: string;
}

export const useEditLogMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: EditLogPayload): Promise<Response<Log>> =>
      fetchWithAuth(`${backendUrl}${logsPath}/${payload.id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              results: oldData.results.map((event) =>
                event.id === variables.eventId
                  ? {
                      ...event,
                      logs: event.logs.map((log) =>
                        log.id === data.results[0].id ? data.results[0] : log
                      ),
                    }
                  : event
              ),
            };
          }
          return oldData;
        }
      );
    },
  });
};

export const useDeleteLogMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");
  const day = searchParams.get("day");

  return useMutation({
    mutationFn: async (payload: { logId: string; eventId: string }) =>
      fetchWithAuth(`${backendUrl}${logsPath}/${payload.logId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["events", { taskId, day }],
        (oldData: Response<PmEvent> | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              results: oldData.results.map((event) =>
                event.id === variables.eventId
                  ? {
                      ...event,
                      logs: event.logs.filter(
                        (log) => log.id !== variables.logId
                      ),
                    }
                  : event
              ),
            };
          }
          return oldData;
        }
      );
    },
    onError: (error: Error) => {
      console.error("Error deleting log:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });
};
