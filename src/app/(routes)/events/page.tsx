"use client";

import DayPicker from "@/components/pm/events/DayPicker";
import EventsList from "@/components/pm/events/EventsList";
import NewEventButton from "@/components/pm/events/CreateEditEventButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useDaysQuery, useDaysSingleQuery } from "@/hooks/use-events";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import DayRangePicker from "@/components/pm/common/DayRangePicker";
import WorkedHoursChart from "@/components/pm/events/WorkedHoursChart";
import MultiMonthCalendar from "@/components/pm/events/MultiMonthCalendar";
import TimeDisplay from "@/components/pm/time/TimeDisplay";
import { EventsSkeleton } from "@/components/pm/common/Skeletons";

export default function Events() {
  const { data: dayData, isLoading: isDayLoading } = useDaysSingleQuery();
  const { data: daysData, isLoading: isDaysLoading } = useDaysQuery();

  const workedDuration = dayData?.results[0].events?.reduce(
    (eventAcc, event) => {
      const eventDuration = event.logs.reduce(
        (logAcc, log) => logAcc + log.duration,
        0
      );
      return eventAcc + eventDuration;
    },
    0
  );

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80} style={{ overflow: "auto" }}>
          <div className="mr-6 space-y-4">
            <div className="space-x-4">
              <NewEventButton />
              <DayPicker />
              <TimeDisplay
                loading={isDayLoading}
                dayId={dayData?.results[0].id || ""}
                start={dayData?.results[0].start || 0}
                workedDuration={workedDuration || 0}
              />
            </div>

            {isDayLoading && <EventsSkeleton />}
            <EventsList events={dayData?.results[0].events || []} />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} style={{ overflow: "auto" }}>
          <div className="ml-6 space-y-4">
            <div className="">
              {isDayLoading ? (
                <div className="h-[300px] flex justify-center items-center">
                  <Skeleton className={`h-48 w-48 rounded-full`} />
                </div>
              ) : (
                <WorkedHoursChart events={dayData?.results[0].events || []} />
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
