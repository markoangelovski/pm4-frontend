"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
} from "lucide-react";
import { format } from "date-fns";
import LogsList from "./LogsList";
import { PmEvent } from "@/types";
import { DeleteButton } from "../common/delete-button";
import PixelArtCircle from "../common/PixelArtCircle";

interface EventItemProps {
  event: PmEvent;
  onDeleteEvent: (eventId: string) => void;
  onUpdateEventTitle: (eventId: string, newTitle: string) => void;
  onUpdateLogTitle: (
    eventId: string,
    logId: string,
    newTitle: string,
    newDuration: number
  ) => void;
  onDeleteLog: (eventId: string, logId: string) => void;
}

export default function EventItem({
  event,
  onDeleteEvent,
  onUpdateEventTitle,
  onUpdateLogTitle,
  onDeleteLog,
}: EventItemProps) {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isEditingEventTitle, setIsEditingEventTitle] = useState(false);
  const [editedEventTitle, setEditedEventTitle] = useState(event.title);
  const eventTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingEventTitle && eventTitleInputRef.current) {
      eventTitleInputRef.current.focus();
    }
  }, [isEditingEventTitle]);

  const totalDuration = event.logs.reduce((sum, log) => sum + log.duration, 0);

  return (
    <div className="border rounded-lg p-4 shadow-sm relative min-h-[120px]">
      <DeleteButton
        variant="ghost"
        title={event.title}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onDelete={() => onDeleteEvent(event.id)}
      />

      <div className="mb-2">
        {isEditingEventTitle ? (
          <input
            ref={eventTitleInputRef}
            type="text"
            value={editedEventTitle}
            onChange={(e) => setEditedEventTitle(e.target.value)}
            onBlur={() => {
              setIsEditingEventTitle(false);
              onUpdateEventTitle(event.id, editedEventTitle);
            }}
            className="text-lg font-semibold w-full"
          />
        ) : (
          <h3
            className="text-lg font-semibold cursor-pointer"
            onClick={() => setIsEditingEventTitle(true)}
          >
            {event.title}
            <Edit2 className="w-4 h-4 inline-block ml-2 text-gray-500" />
          </h3>
        )}
        {event.task && (
          <Link
            href={`/tasks?taskId=${event.task.id}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <PixelArtCircle input={event.task.id} />
            {event.task.title}
          </Link>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {format(new Date(event.day), "MMMM dd, yyyy")}
        </span>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <span className="text-3xl font-bold flex items-center justify-center gap-2">
          <Clock className="w-6 h-6 text-gray-500" />
          {totalDuration.toFixed(2)}h
        </span>
      </div>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setIsLogsOpen(!isLogsOpen)}
          className="text-sm text-gray-600 flex items-center gap-1"
        >
          {isLogsOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {isLogsOpen ? "Hide Logs" : "Show Logs"}
        </button>
      </div>

      {isLogsOpen && (
        <LogsList
          logs={event.logs}
          onUpdateLogTitle={(logId, newTitle, newDuration) =>
            onUpdateLogTitle(event.id, logId, newTitle, newDuration)
          }
          onDeleteLog={(logId) => onDeleteLog(event.id, logId)}
        />
      )}
    </div>
  );
}
