"use client";

import { useState, useEffect, Fragment } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types";
import Header from "@/components/pm/Header/Header";
import TaskSortNew from "@/components/pm/Tasks/TaskSortNew";
import TasksListRow from "@/components/pm/Tasks/TasksListRow";
import { useGetTasks } from "@/hooks/use-tasks";
import TableSkeleton from "@/components/pm/Projects/TableSkeleton";
import { useQueryClient } from "@tanstack/react-query";

const TaskList2 = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId") || "";
  const statusId = searchParams.get("status") || "";

  const queryClient = useQueryClient();

  const {
    data: tasksData,
    isLoading,
    error,
  } = useGetTasks(projectId, statusId);

  useEffect(() => {
    // Refecth tasks when projectId or statusId changes
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }, [projectId, statusId]);

  const [filteredTasks, setFilteredTasks] = useState<Task[] | undefined>([]);
  const [reRender, setReRender] = useState(false);

  const handleSortAndFilter = () => {
    const sortType = searchParams.get("sort");
    const filterType = searchParams.get("q");

    let filteredTasks = tasksData?.data;

    if (filterType) {
      filteredTasks = tasksData?.data?.filter(
        (task) =>
          task.title.toLowerCase().includes(filterType.toLowerCase()) ||
          task.description?.toLowerCase().includes(filterType.toLowerCase()) ||
          task.pl?.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    switch (sortType) {
      case "title":
        filteredTasks?.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        filteredTasks?.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
        break;
      case "updated":
        filteredTasks?.sort(
          (a, b) =>
            new Date(b.modifiedAt || b.createdAt || "").getTime() -
            new Date(a.modifiedAt || a.createdAt || "").getTime()
        );
        break;
      case "due-date":
        filteredTasks?.sort(
          (a, b) =>
            new Date(b.dueDate || "9999-12-31").getTime() -
            new Date(a.dueDate || "9999-12-31").getTime()
        );
        break;
      case "pl":
        filteredTasks?.sort((a, b) => (a?.pl || "").localeCompare(b.pl || ""));
        break;
      default:
        console.warn("Invalid sort type:", sortType);
        break;
    }
    setReRender(!reRender);
    setFilteredTasks(filteredTasks);
  };

  useEffect(() => {
    handleSortAndFilter();
  }, [searchParams, tasksData?.data]);

  return (
    <>
      <TaskSortNew />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Program Lead</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Date Modified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton columns={7} />}
          {filteredTasks?.length
            ? filteredTasks?.map((task) => (
                <TasksListRow key={task.id} task={task} />
              ))
            : tasksData?.data?.map((task) => (
                <TasksListRow key={task.id} task={task} />
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default TaskList2;
