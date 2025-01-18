import { PmEvent } from "@/types";
import EventItem from "./EventItem";

interface EventsListProps {
  events: PmEvent[];
}

export default function EventsList({ events }: EventsListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
}
