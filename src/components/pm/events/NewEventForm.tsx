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
import { useCreateEventMutation, useEventsQuery } from "@/hooks/use-events";

const formSchema = z.object({
  title: z.string().min(1, "Event title is required"),
  logTitle: z.string().min(1, "Log title is required"),
  duration: z
    .number()
    .min(0, "Duration must be at least 0")
    .step(0.25, "Duration must be in increments of 0.25"),
  taskId: z.string().uuid("Invalid task ID").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

interface NewEventFormProps {
  onSuccess: () => void;
}

export default function NewEventForm({ onSuccess }: NewEventFormProps) {
  const searchParams = useSearchParams();
  const day = searchParams.get("day") || "";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      logTitle: "",
      duration: 0.25,
      taskId: "",
    },
  });

  const createEventMutation = useCreateEventMutation();
  const eventsQuery = useEventsQuery();

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        day,
        taskId: data.taskId || undefined,
      };
      await createEventMutation.mutateAsync(payload);
      // eventsQuery.refetch();
      onSuccess();
    } catch (error) {
      console.error("Failed to create event:", error);
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
        <FormField
          control={form.control}
          name="logTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Log Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createEventMutation.isPending}>
          {createEventMutation.isPending ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}
