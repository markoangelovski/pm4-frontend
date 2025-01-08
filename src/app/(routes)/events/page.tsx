"use client";

import DayPicker from "@/components/pm/events/DayPicker";
import EventsList from "@/components/pm/events/EventsList";
import NewEventButton from "@/components/pm/events/CreateEditEventButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useEventsQuery } from "@/hooks/use-events";

export default function Events() {
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();

  return (
    <>
      <div className="space-x-4">
        <NewEventButton />
        <DayPicker />
      </div>

      {isEventsLoading && <EventsSkeleton />}
      <EventsList events={eventsData?.results || []} />
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
