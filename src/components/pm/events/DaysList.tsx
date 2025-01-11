import { Day } from "@/types";
import EventItem from "./EventItem";
import DayItem from "./DayItem";

interface DaysListProps {
  days: Day[];
}

export default function DaysList({ days }: DaysListProps) {
  return (
    <div className="space-y-4">
      {days.map((day) => (
        <DayItem key={day.day} day={day.day} />
      ))}
    </div>
  );
}
