"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCreateLogMutation } from "@/hooks/use-events";
import { Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Log title is required"),
  duration: z
    .number()
    .min(0, "Duration must be at least 0")
    .step(0.25, "Duration must be in increments of 0.25"),
});

type FormData = z.infer<typeof formSchema>;

interface AddLogDialogProps {
  eventId: string;
  onSuccess: () => void;
}

export default function AddLogDialog({
  eventId,
  onSuccess,
}: AddLogDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      duration: 0.25,
    },
  });

  const createLogMutation = useCreateLogMutation();

  const onSubmit = async (data: FormData) => {
    try {
      await createLogMutation.mutateAsync({
        ...data,
        eventId,
      });
      setOpen(false);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-sm text-gray-600 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add Log
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Log</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createLogMutation.isPending}>
              {createLogMutation.isPending ? "Adding Log..." : "Add Log"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
