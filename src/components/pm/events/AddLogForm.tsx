"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCreateLogMutation } from "@/hooks/use-events"; // Updated import statement

const formSchema = z.object({
  title: z.string().min(1, "Log title is required"),
  duration: z
    .number()
    .min(0, "Duration must be at least 0")
    .step(0.25, "Duration must be in increments of 0.25"),
});

type FormData = z.infer<typeof formSchema>;

interface AddLogFormProps {
  eventId: string;
  onSuccess: () => void;
}

export default function AddLogForm({ eventId, onSuccess }: AddLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 0.25,
    },
  });

  const createLogMutation = useCreateLogMutation();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createLogMutation.mutateAsync({
        ...data,
        eventId,
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create log:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="title"
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding Log..." : "Add Log"}
        </Button>
      </form>
    </Form>
  );
}
