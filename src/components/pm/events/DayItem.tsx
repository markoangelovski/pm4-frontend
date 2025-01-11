"use client";

import { format, parseISO } from "date-fns";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface DayItemProps {
  day: string;
}

export default function DayItem({ day }: DayItemProps) {
  const searchParams = useSearchParams();

  const date = parseISO(day);
  const formattedDate = format(date, "MMMM do, yyyy");

  const params = new URLSearchParams(searchParams);
  params.set("day", day.split("T")[0]);

  return (
    <div>
      <Link
        href={`/events?${params.toString()}`}
        className="text-blue-600 hover:underline"
      >
        {formattedDate}
      </Link>
    </div>
  );
}
