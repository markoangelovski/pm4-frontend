"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/pm/Header/Header";
import { Suspense } from "react";
import { useGetTasks } from "@/hooks/use-tasks";
import TaskList2 from "@/components/pm/Tasks/TaskList2";

function TasksComponent() {
  const searchParams = useSearchParams();

  // const { data: tasksData, isLoading, error } = useGetTasks();

  const taskId = new URLSearchParams(searchParams).get("taskId");

  // if (taskId) return <TaskDetail />;

  return (
    <>
      <Header breadcrumbs={["Tasks"]} />
      <div className="container mx-auto p-4 space-y-6">
        {/* <TaskList2 isLoading={isLoading} tasksList={tasksData?.data} /> */}
        <TaskList2 /* isLoading={isLoading} tasksList={tasksData?.data} */ />
      </div>
    </>
  );
}

export default function Tasks() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TasksComponent />
    </Suspense>
  );
}
