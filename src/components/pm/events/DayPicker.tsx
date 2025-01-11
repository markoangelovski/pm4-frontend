"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export default function DayPicker() {
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState<boolean>(false); // Manage popover state
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const params = new URLSearchParams(searchParams.toString());
      params.set("day", formattedDate);
      router.push(`?${params.toString()}`); // Update query parameter
      setIsOpen(false); // Close the popover
    }
  };

  // useEffect to check and set the query param on initial load
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const dayParam = params.get("day");

    if (!dayParam) {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      params.set("day", currentDate);
      router.push(`?${params.toString()}`); // Add query param with current date
      setDate(new Date());
    } else {
      setDate(new Date(dayParam)); // Set initial date from query param
    }
  }, [searchParams, router]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect} // Use custom handler
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
