"use client";

import FilterSort from "@/components/pm/common/filter-sort";
import StatusSelect from "@/components/pm/tasks/StatusSelect";
import TaskDetailPage from "@/components/pm/tasks/task-detail";
import TaskList from "@/components/pm/tasks/task-list";
import { useTasksQuery } from "@/hooks/use-tasks";
import { useSearchParams } from "next/navigation";

export default function Tasks() {
  const { data: tasksData } = useTasksQuery();

  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");

  if (taskId) return <TaskDetailPage taskId={taskId} />;

  return (
    <>
      <FilterSort />
      <StatusSelect />
      <TaskList tasksData={tasksData?.results || []} />
    </>
  );
}
