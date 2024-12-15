"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";

import Header from "@/components/pm/Header/Header";
import { days, tasks } from "@/mocks";
import { Log, PmEvent, UUID } from "@/types";
import { useUpdateQueryParam } from "@/hooks/use-helpers";
import { useSearchParams } from "next/navigation";
import { useDeleteEvent } from "@/hooks/use-events";

const logSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.number().min(0).default(0),
});

export default function EventRow({
  event,
  setEditingEvent,
}: {
  event: PmEvent;
  setEditingEvent: (event: PmEvent) => void;
}) {
  const [events, setEvents] = useState<PmEvent[]>(
    days.map((d) => d.events).flat()
  );
  const [addingLog, setAddingLog] = useState<string | null>(null);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  // const [editingEvent, setEditingEvent] = useState<PmEvent | null>(null);
  const [editingLog, setEditingLog] = useState<{
    eventId: string;
    log: Log;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "event" | "log";
    id: string;
    title: string;
  } | null>(null);

  const {
    mutate: deleteEvent,
    isPending: isDeleteEventPending,
    error: deleteEventError,
  } = useDeleteEvent(event.id);

  const formatDuration = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes}min`;
    } else {
      return "0min";
    }
  }, []);

  const toggleAddingLog = useCallback((eventId: string) => {
    setAddingLog((prev) => (prev === eventId ? null : eventId));
  }, []);

  const toggleEventExpansion = useCallback((eventId: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  }, []);

  const handleAddLog = useCallback(
    (eventId: string, data: z.infer<typeof logSchema>) => {
      setEvents((prev) =>
        prev.map((e) => {
          if (e.id === eventId) {
            const newLogs = [
              ...e.logs,
              {
                id: uuidv4(),
                ...data,
                createdAt: new Date(),
                modifiedAt: new Date(),
                eventId: e.id,
                description: data.title,
              },
            ];
            return {
              ...e,
              logs: newLogs,
              duration: newLogs.reduce((sum, l) => sum + l.duration, 0),
            };
          }
          return e;
        })
      );
      setAddingLog(null);
    },
    []
  );

  const handleDeleteEvent = useCallback((eventId: string) => {
    deleteEvent();
    setDeleteConfirm(null);
  }, []);

  const handleDeleteLog = useCallback((eventId: string, logId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const newLogs = e.logs.filter((l) => l.id !== logId);
          return {
            ...e,
            logs: newLogs,
            duration: newLogs.reduce((sum, l) => sum + l.duration, 0),
          };
        }
        return e;
      })
    );
    setDeleteConfirm(null);
  }, []);

  const LogForm = ({
    onSubmit,
    onCancel,
    initialData,
  }: {
    onSubmit: (data: z.infer<typeof logSchema>) => void;
    onCancel: () => void;
    initialData?: Partial<Log>;
  }) => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<z.infer<typeof logSchema>>({
      resolver: zodResolver(logSchema),
      defaultValues: initialData || { duration: 0 },
    });

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="log-title" className="text-right">
            Title
          </Label>
          <div className="col-span-3">
            <Input id="log-title" {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="log-duration" className="text-right">
            Duration (min)
          </Label>
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                id="log-duration"
                {...field}
                onChange={(e) =>
                  field.onChange(Math.round(Number(e.target.value) / 15) * 15)
                }
                className="col-span-3"
              />
            )}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm col-start-2 col-span-3">
              {errors.duration.message}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? "Update Log" : "Add Log"}
          </Button>
        </DialogFooter>
      </form>
    );
  };

  return (
    <>
      <Collapsible className="mb-4 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
              <ListChecks className="h-4 w-4" />
              {event.task && (
                <Link
                  href={`/tasks?taskId=${event.task.id}`}
                  className="hover:underline"
                >
                  {event.task.title}
                </Link>
              )}
              <span>-</span>
              <span>{format(event.createdAt, "MMM d, yyyy")}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Total worked: {formatDuration(event.duration)}
            </p>
            <p className="text-sm text-gray-500">
              Total booked: {formatDuration(event.totalBooked)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleAddingLog(event.id)}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleEventExpansion(event.id)}
              >
                {expandedEvents.has(event.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingEvent(event)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setDeleteConfirm({
                  type: "event",
                  id: event.id,
                  title: event.title,
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {addingLog === event.id && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Add New Log</h3>
            <LogForm
              onSubmit={(data) => handleAddLog(event.id, data)}
              onCancel={() => setAddingLog(null)}
            />
          </div>
        )}
        <CollapsibleContent>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>{formatDuration(log.duration)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingLog({ eventId: event.id, log })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setDeleteConfirm({
                          type: "log",
                          id: log.id,
                          title: log.title,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete {deleteConfirm?.title}?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm?.type === "event") {
                  handleDeleteEvent(deleteConfirm.id);
                } else if (deleteConfirm?.type === "log") {
                  const event = events.find((e) =>
                    e.logs.some((l) => l.id === deleteConfirm.id)
                  );
                  if (event) handleDeleteLog(event.id, deleteConfirm.id);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
