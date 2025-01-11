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
import WorkedHoursChart from "@/components/pm/events/WorkedHoursChart";
import MultiMonthCalendar from "@/components/pm/events/MultiMonthCalendar";

export default function Events() {
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();
  const { data: daysData, isLoading: isDaysLoading } = useDaysQuery();

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80} style={{ overflow: "auto" }}>
          <div className="mr-6 space-y-4">
            <div className="space-x-4">
              <NewEventButton />
              <DayPicker />
            </div>

            {isEventsLoading && <EventsSkeleton />}
            <EventsList events={eventsData?.results || []} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} style={{ overflow: "auto" }}>
          <div className="ml-6 space-y-4">
            <div className="">
              {isEventsLoading ? (
                <div className="h-[300px] flex justify-center items-center">
                  <Skeleton className={`h-48 w-48 rounded-full`} />
                </div>
              ) : (
                <WorkedHoursChart events={eventsData?.results || []} />
              )}
            </div>

            <DayRangePicker />

            {isDaysLoading ? (
              <Skeleton className={`h-72 w-56 mx-auto`} />
            ) : (
              <MultiMonthCalendar days={daysData?.results || []} />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
    </div>
  );
}
