import { PmEvent } from "@/types";
import EventItem from "./EventItem";

interface EventsListProps {
  events: PmEvent[];
  onDeleteEvent: (eventId: string) => void;
  onUpdateEventTitle: (eventId: string, newTitle: string) => void;
  onUpdateLogTitle: (
    eventId: string,
    logId: string,
    newTitle: string,
    newDuration: number
  ) => void;
  onDeleteLog: (eventId: string, logId: string) => void;
}

export default function EventsList({
  events,
  onDeleteEvent,
  onUpdateEventTitle,
  onUpdateLogTitle,
  onDeleteLog,
}: EventsListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          onDeleteEvent={onDeleteEvent}
          onUpdateEventTitle={onUpdateEventTitle}
          onUpdateLogTitle={onUpdateLogTitle}
          onDeleteLog={onDeleteLog}
        />
      ))}
    </div>
  );
}
