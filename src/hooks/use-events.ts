import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { Day, Log, PmEvent, Response } from "@/types";
import { useSearchParams } from "next/navigation";
import { toast } from "./use-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const eventsPath = process.env.NEXT_PUBLIC_EVENTS_PATH;
const daysPath = process.env.NEXT_PUBLIC_DAYS_PATH;
const daysSinglePath = process.env.NEXT_PUBLIC_DAYS_SINGLE_PATH;
const logsPath = process.env.NEXT_PUBLIC_LOGS_PATH;

// export const useEventsQuery = () => {
//   const url = new URL(`${backendUrl}${eventsPath}`);
//   const searchParams = useSearchParams();

//   const taskId = searchParams.get("taskId");
//   const day = searchParams.get("day");

//   if (taskId) url.searchParams.append("taskId", taskId);
//   if (day) url.searchParams.append("day", day);

//   return useQuery({
//     queryKey: ["events", { taskId, day }],
//     queryFn: (): Promise<Response<PmEvent>> => fetchWithAuth(url.toString()),
//     retry: false,
//   });
// };

export const useDaysQuery = () => {
  const url = new URL(`${backendUrl}${daysPath}`);
  const searchParams = useSearchParams();

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (start) url.searchParams.append("start", start);
  if (end) url.searchParams.append("end", end);

  return useQuery({
    queryKey: ["days", { start, end }],
    queryFn: (): Promise<Response<Day>> => fetchWithAuth(url.toString()),
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

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: CreateEventPayload): Promise<Response<PmEvent>> =>
      fetchWithAuth(`${backendUrl}${eventsPath}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          const eventToAdd = data.results[0];
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((day) =>
                  day.id === eventToAdd.dayId
                    ? {
                        ...day,
                        events: day.events
                          ? [...day.events, eventToAdd]
                          : [eventToAdd], // Ensure events is always an array
                      }
                    : day
                ),
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

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: EditEventPayload): Promise<Response<PmEvent>> =>
      fetchWithAuth(`${backendUrl}${eventsPath}/${payload.id}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["day", { day }] });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: async (eventId: string) =>
      fetchWithAuth(`${backendUrl}${eventsPath}/${eventId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((result) => ({
                  ...result,
                  events: result?.events?.filter(
                    (event) => event.id !== variables
                  ),
                })),
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

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: CreateLogPayload): Promise<Response<Log>> =>
      fetchWithAuth(`${backendUrl}${logsPath}`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          const logToAdd = data.results[0];
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((result) => ({
                  ...result,
                  events: result.events?.map((event) =>
                    event.id === logToAdd.eventId
                      ? {
                          ...event,
                          logs: [...event.logs, logToAdd],
                        }
                      : event
                  ),
                })),
              }
            : oldData;
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
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          const logToUpdate = data.results[0];
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((result) => ({
                  ...result,
                  events: result?.events?.map((event) => ({
                    ...event,
                    logs: event.logs.map(
                      (log) =>
                        log.id === logToUpdate.id
                          ? { ...log, ...logToUpdate } // Update the matching log
                          : log // Keep other logs unchanged
                    ),
                  })),
                })),
              }
            : oldData;
        }
      );
    },
  });
};

export const useDeleteLogMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: async (payload: { logId: string; eventId: string }) =>
      fetchWithAuth(`${backendUrl}${logsPath}/${payload.logId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          const { logId, eventId } = variables;
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((result) => ({
                  ...result,
                  events: result?.events?.map(
                    (event) =>
                      event.id === eventId
                        ? {
                            ...event,
                            logs: event.logs.filter((log) => log.id !== logId), // Remove the log with matching logId
                          }
                        : event // Keep other events unchanged
                  ),
                })),
              }
            : oldData;
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

export const useDaysSingleQuery = () => {
  const url = new URL(`${backendUrl}${daysSinglePath}`);
  const searchParams = useSearchParams();

  const day = searchParams.get("day");

  if (day) url.searchParams.append("day", day);

  return useQuery({
    queryKey: ["day", { day }],
    queryFn: (): Promise<Response<Day>> => fetchWithAuth(url.toString()),
    retry: false,
  });
};

export const useEditDayMutation = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const day = searchParams.get("day");

  return useMutation({
    mutationFn: (payload: Day): Promise<Response<Day>> =>
      fetchWithAuth(
        `${backendUrl}${daysPath}/${payload.id}?start=${payload.start}`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["day", { day }],
        (oldData: Response<Day> | undefined) => {
          return oldData
            ? {
                ...oldData,
                results: oldData.results.map((day) =>
                  day.id === variables.id
                    ? { ...oldData.results[0], ...data.results[0] }
                    : day
                ),
              }
            : data;
        }
      );
    },
  });
};
