"use client";

import DayPicker from "@/components/pm/events/DayPicker";
import EventsList from "@/components/pm/events/EventsList";
import NewEventButton from "@/components/pm/events/NewEventButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteEventMutation, useEventsQuery } from "@/hooks/use-events";

export default function Events() {
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();
  const { mutate: deleteEventCall } = useDeleteEventMutation();

  const handleDeleteEvent = (eventId: string) => {
    // Implement event deletion logic
    console.log("Delete event", eventId);
    deleteEventCall(eventId);
  };

  const handleUpdateEventTitle = (eventId: string, newTitle: string) => {
    // Implement event title update logic
    console.log("handleUpdateEventTitle", eventId, newTitle);
  };

  const handleUpdateLogTitle = (
    eventId: string,
    logId: string,
    newTitle: string,
    newDuration: number
  ) => {
    // Implement log title and duration update logic
    console.log("handleUpdateLogTitle", eventId, logId, newTitle, newDuration);
  };
  const handleDeleteLog = (eventId: string, logId: string) => {
    // Implement log deletion logic
    console.log("handleDeleteLog", eventId, logId);
  };

  return (
    <>
      <div className="space-x-4">
        <NewEventButton />
        <DayPicker />
      </div>

      {isEventsLoading && <EventsSkeleton />}
      <EventsList
        events={eventsData?.results || []}
        onDeleteEvent={handleDeleteEvent}
        onUpdateEventTitle={handleUpdateEventTitle}
        onUpdateLogTitle={handleUpdateLogTitle}
        onDeleteLog={handleDeleteLog}
      />
    </>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 " />
      <Skeleton className="h-32 " />
      <Skeleton className="h-32 " />
    </div>
  );
}
