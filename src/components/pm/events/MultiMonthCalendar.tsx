"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { groupDatesByMonth } from "@/lib/utils";
import { Day } from "@/types";
import { format } from "date-fns";

interface MultiMonthCalendarProps {
  days: Day[];
}

export default function MultiMonthCalendar({ days }: MultiMonthCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(() => {
    const day = searchParams.get("day");
    return day ? new Date(day) : undefined;
  });

  const groupedDates = groupDatesByMonth(days.map((d) => d?.day || ""));

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const selectedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setSelectedDay(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const params = new URLSearchParams(searchParams.toString());
      params.set("day", formattedDate);
      router.push(`?${params.toString()}`); // Update query parameter
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const dayParam = params.get("day");

    if (!dayParam) {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      params.set("day", currentDate);
      router.push(`?${params.toString()}`); // Add query param with current date
      setSelectedDay(new Date());
    } else {
      setSelectedDay(new Date(dayParam)); // Set initial date from query param
    }
  }, [searchParams, router]);

  const isDateMarked = (date: Date) => {
    const selectedDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    return days.some((d) => {
      const dayDate = new Date(d?.day || "");
      const dayDateUtc = new Date(
        Date.UTC(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate())
      );
      return selectedDate.toISOString() === dayDateUtc.toISOString();
    });
  };

  return (
    <div className="flex justify-center">
      <div className="inline-block space-y-4">
        <>
          {Object.entries(groupedDates).map(([monthKey, dates]) => {
            const [year, month] = monthKey.split("-").map(Number);
            return (
              <Calendar
                key={monthKey}
                mode="single"
                selected={selectedDay}
                onSelect={handleDateSelect}
                className="border rounded-md"
                month={new Date(year, month - 1)}
                modifiers={{ marked: dates }}
                modifiersStyles={{
                  marked: { backgroundColor: "lightblue", borderRadius: "50%" },
                }}
                disabled={(date) => !isDateMarked(date)}
              />
            );
          })}
        </>
      </div>
    </div>
  );
}
