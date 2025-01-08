"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchTask from "./SearchTask";
import {
  useCreateEventMutation,
  useEditEventMutation,
} from "@/hooks/use-events";
import { PmEvent } from "@/types";

const formSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  logTitle: z.string().optional(),
  duration: z
    .number()
    .min(0, "Duration must be at least 0")
    .step(0.25, "Duration must be in increments of 0.25")
    .optional(),
  taskId: z.string().uuid("Invalid task ID").optional().or(z.literal("")),
  day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
});

type FormData = z.infer<typeof formSchema>;

interface CreateEditEventFormProps {
  event?: PmEvent;
  onSuccess: () => void;
}

export default function CreateEditEventForm({
  event,
  onSuccess,
}: CreateEditEventFormProps) {
  const searchParams = useSearchParams();
  const defaultDay =
    searchParams.get("day") || new Date().toISOString().split("T")[0];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      logTitle: event ? undefined : "",
      duration: event?.logs[0]?.duration || 0.25,
      taskId: event?.task?.id || "",
      day: event ? event.day : defaultDay,
    },
  });

  const createEventMutation = useCreateEventMutation();
  const editEventMutation = useEditEventMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        taskId: data.taskId || undefined,
      };

      if (event) {
        await editEventMutation.mutateAsync({ id: event.id, ...payload });
      } else {
        await createEventMutation.mutateAsync(payload);
      }

      onSuccess();
    } catch (error) {
      console.error("Failed to create/edit event:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!event && (
          <FormField
            control={form.control}
            name="logTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Log Title (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {!event && (
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={0.25}
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="taskId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task (Optional)</FormLabel>
              <FormControl>
                <SearchTask
                  onSelect={(taskId) => field.onChange(taskId || "")}
                  value={field.value}
                  initialTaskTitle={event?.task?.title}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={
            createEventMutation.isPending || editEventMutation.isPending
          }
        >
          {event ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
