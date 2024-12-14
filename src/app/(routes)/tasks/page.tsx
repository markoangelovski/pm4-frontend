"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/pm/Header/Header";
import { useGetTasks } from "@/hooks/use-tasks";
import TaskList2 from "@/components/pm/Tasks/TaskList2";
import TaskDetail from "@/components/pm/Tasks/TaskDetail";

export default function Tasks() {
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");

  if (taskId) return <TaskDetail />;

  return (
    <>
      <Header breadcrumbs={["Tasks"]} />
      <div className="container mx-auto p-4 space-y-6">
        <TaskList2 />
      </div>
    </>
  );
}
