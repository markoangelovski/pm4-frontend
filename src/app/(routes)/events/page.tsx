"use client";

import DayPicker from "@/components/pm/events/DayPicker";
import EventsList from "@/components/pm/events/EventsList";
import NewEventButton from "@/components/pm/events/CreateEditEventButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useDaysQuery, useEventsQuery } from "@/hooks/use-events";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DayRangePicker from "@/components/pm/events/DayRangePicker";
import DaysList from "@/components/pm/events/DaysList";

export default function Events() {
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();
  const { data: daysData, isLoading: isDaysLoading } = useDaysQuery();

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75} style={{ overflow: "auto" }}>
          <div className="mr-6">
            <div className="space-x-4 mb-6">
              <NewEventButton />
              <DayPicker />
            </div>
            {isEventsLoading && <EventsSkeleton h="32" />}
            <EventsList events={eventsData?.results || []} />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="ml-6">
            <div className="space-x-4 mb-6">
              <DayRangePicker />
            </div>
            {isDaysLoading && <EventsSkeleton h="8" />}
            <DaysList days={daysData?.results || []} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

function EventsSkeleton({ h }: { h: string }) {
  return (
    <div className="space-y-4">
      <Skeleton className={`h-${h}`} />
      <Skeleton className={`h-${h}`} />
      <Skeleton className={`h-${h}`} />
    </div>
  );
}
