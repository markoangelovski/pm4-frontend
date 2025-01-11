"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startOfMonth, endOfMonth, format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export default function DayRangePicker() {
  const [date, setDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  const handleGoClick = () => {
    if (date?.from && date?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("start", format(date.from, "yyyy-MM-dd"));
      params.set("end", format(date.to, "yyyy-MM-dd"));
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const startParam = params.get("start");
    const endParam = params.get("end");

    let start: Date;
    let end: Date;

    if (startParam && endParam) {
      const parsedStart = parse(startParam, "yyyy-MM-dd", new Date());
      const parsedEnd = parse(endParam, "yyyy-MM-dd", new Date());

      start = isValid(parsedStart) ? parsedStart : startOfMonth(new Date());
      end = isValid(parsedEnd) ? parsedEnd : endOfMonth(new Date());
    } else {
      start = startOfMonth(new Date());
      end = endOfMonth(new Date());
    }

    setDate({ from: start, to: end });
    params.set("start", format(start, "yyyy-MM-dd"));
    params.set("end", format(end, "yyyy-MM-dd"));
    router.push(`?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="grid gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            fromDate={new Date(1900, 0, 1)} // Set a reasonable minimum date
            toDate={new Date(2100, 11, 31)} // Set a reasonable maximum date
          />
          <div className="p-3 border-t border-border">
            <Button className="w-full" onClick={handleGoClick}>
              Go
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
