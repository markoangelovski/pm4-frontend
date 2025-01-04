"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskFromServer } from "@/types";
import PixelArtCircle from "../common/PixelArtCircle";
import { format } from "date-fns";
import { prettyStatus } from "@/lib/utils";
import { Link2 } from "lucide-react";

export default function TaskList({
  tasksData,
}: {
  tasksData: TaskFromServer[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("f");
  const sortParam = searchParams.get("sort");

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasksData];

    // Apply filtering
    if (filterParam) {
      const lowerFilter = filterParam.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerFilter) ||
          task.pl.toLowerCase().includes(lowerFilter)
      );
    }

    // Apply sorting
    if (sortParam) {
      result.sort((a, b) => {
        switch (sortParam) {
          case "title":
            return a.title.localeCompare(b.title);
          case "pl":
            return a.pl.localeCompare(b.pl);
          case "created":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "modified":
            return (
              new Date(a.modifiedAt).getTime() -
              new Date(b.modifiedAt).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return result;
  }, [tasksData, filterParam, sortParam]);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Project Lead</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Modified At</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/tasks?taskId=${task.id}`);
                  }}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <PixelArtCircle input={task.id} />
                  {task.title}
                </Link>
              </TableCell>
              <TableCell>{prettyStatus(task.status)}</TableCell>

              <TableCell>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("pl", task.pl);
                    router.push(`/tasks?${params.toString()}`);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {task.pl}
                </Link>
              </TableCell>

              <TableCell>{format(task.createdAt, "MMMM LL, yyyy")}</TableCell>
              <TableCell>{format(task.modifiedAt, "MMMM LL, yyyy")}</TableCell>
              <TableCell>
                {task.jiraLink && (
                  <Link
                    href={task.jiraLink}
                    target="_blank"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Link2 className="" size={16} />
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
