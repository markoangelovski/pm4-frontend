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
import WorkedHoursChart from "@/components/pm/events/WorkedHoursChart";

export default function Events() {
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();
  const { data: daysData, isLoading: isDaysLoading } = useDaysQuery();

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={75} style={{ overflow: "auto" }}>
          <div className="mr-6 space-y-4">
            <div className="space-x-4">
              <NewEventButton />
              <DayPicker />
            </div>

            {isEventsLoading && <EventsSkeleton h="32" />}
            <EventsList events={eventsData?.results || []} />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={25}>
          <div className="ml-6 space-y-4">
            <div className="">
              {isEventsLoading ? (
                <Skeleton className={`h-48 w-48 rounded-full mx-auto my-12`} />
              ) : (
                <WorkedHoursChart events={eventsData?.results || []} />
              )}
            </div>

            <DayRangePicker />

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
      <Skeleton className={`h-32 h-${h}`} />
      <Skeleton className={`h-32 h-${h}`} />
      <Skeleton className={`h-32 h-${h}`} />
    </div>
  );
}
