"use client";

import { Fragment, useState } from "react";
import { Stat, PmEvent, Log } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircularProgress } from "./CircularProgress";
import Link from "next/link";
import { Link2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import PixelArtCircle from "../common/PixelArtCircle";

interface StatItemProps {
  stat: Stat;
}

export default function StatItem({ stat }: StatItemProps) {
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  const toggleEvent = (index: number) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const totalHours =
    stat.events?.reduce(
      (acc, event) =>
        acc +
        (event.logs?.reduce((logAcc, log) => logAcc + (log.duration || 0), 0) ||
          0),
      0
    ) || 0;

  const bookedHours = 7.5; // This would come from your data
  const externalHours = 0; // This would come from your data
  const overtimeHours = Math.max(totalHours - 8, 0);

  const formatHours = (hours: number) => `${hours.toFixed(2)}h`;

  const renderMetricCard = (
    progress: number,
    hours: number,
    label: string,
    color: string
  ) => (
    <Card className="flex items-center justify-between p-4 rounded-lg">
      <CircularProgress value={progress} color={color} />
      <div className="text-right">
        <div className="text-2xl font-semibold">{formatHours(hours)}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </Card>
  );

  const renderEventRow = (event: PmEvent, index: number) => {
    const isExpanded = expandedEvents.has(index);
    const totalDuration =
      event.logs?.reduce((acc, log) => acc + (log.duration || 0), 0) || 0;

    return (
      <Fragment key={`${event.title}-${index}`}>
        <TableRow
          className={` hover:bg-muted/50 ${
            index % 2 === 0 ? "bg-muted/10" : ""
          }`}
          onClick={() => toggleEvent(index)}
        >
          <TableCell className="w-[40%]">
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="truncate">{event.title}</span>
              {event.logs?.length > 0 &&
                (isExpanded ? (
                  <ChevronUp className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ))}
            </div>
          </TableCell>
          <TableCell className="w-[15%]">
            {formatHours(totalDuration)}
          </TableCell>
          <TableCell className="w-[40%]">
            {event.task && (
              <Link
                href={`/tasks?taskId=${event.task.id}`}
                className="text-blue-500 hover:underline truncate block flex items-center"
              >
                <PixelArtCircle input={event.task.id} className="mr-2" />
                {event.task.title}
              </Link>
            )}
          </TableCell>
          <TableCell className="w-[5%]">
            {event.task?.jiraLink && (
              <a
                href={event.task.jiraLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Link2 className="h-4 w-4 text-blue-500" />
              </a>
            )}
          </TableCell>
        </TableRow>
        {isExpanded &&
          event.logs?.map((log: Log, logIndex: number) => (
            <TableRow
              key={`${event.title}-${index}-${log.title}-${logIndex}`}
              className={`${index % 2 === 0 ? "bg-muted/20" : "bg-muted/30"}`}
            >
              <TableCell className="w-[40%]">
                <span className="text-muted-foreground truncate block">
                  - {log.title}
                </span>
              </TableCell>
              <TableCell className="w-[15%] text-muted-foreground">
                {formatHours(log.duration)}
              </TableCell>
              <TableCell className="w-[40%]"></TableCell>
              <TableCell className="w-[5%]"></TableCell>
            </TableRow>
          ))}
      </Fragment>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderMetricCard(
          (totalHours / 8) * 100,
          totalHours,
          "Hours worked",
          "rgb(14, 165, 233)" // sky-500
        )}
        {renderMetricCard(
          (bookedHours / 8) * 100,
          bookedHours,
          "Hours booked",
          "rgb(34, 197, 94)" // green-500
        )}
        {renderMetricCard(
          0,
          externalHours,
          "External bookings",
          "rgb(156, 163, 175)" // gray-400
        )}
        {renderMetricCard(
          (overtimeHours / 8) * 100,
          overtimeHours,
          "Overtime",
          "rgb(239, 68, 68)" // red-500
        )}
      </div>
      <Card className="rounded-lg">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <Link
              href={`/events?day=${format(
                new Date(stat.day || ""),
                "yyyy-MM-dd"
              )}`}
              className="text-xl font-semibold text-blue-500 hover:underline"
            >
              {format(new Date(stat.day || ""), "EEEE, MMMM do yyyy")}
            </Link>
          </div>
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Event</TableHead>
                  <TableHead className="w-[15%]">Worked</TableHead>
                  <TableHead className="w-[40%]">Task</TableHead>
                  <TableHead className="w-[5%]">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stat.events?.map((event, index) =>
                  renderEventRow(event, index)
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
