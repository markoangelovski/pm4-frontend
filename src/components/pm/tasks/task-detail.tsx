"use client";

import { useDeleteTaskMutation, useTaskQuery } from "@/hooks/use-tasks";
import FilterSort from "../common/filter-sort";
import { TaskButtons } from "../tasks/TaskButtons";
import TitleDescription from "../common/TitleDescription";
import { DetailPageSkeleton } from "../common/DetailPageSkeleton";
import DetailPageCards from "../common/DetailPageCards";
import { DeleteButton } from "../common/delete-button";
import EventsList from "../events/EventsList";
import { useEventsQuery } from "@/hooks/use-events";
import { EventsSkeleton } from "@/app/(routes)/events/page";

export default function TaskDetailPage({ taskId }: { taskId: string }) {
  const { data: taskData, isLoading: isTaskLoading } = useTaskQuery(taskId);
  const { data: eventsData, isLoading: isEventsLoading } = useEventsQuery();
  const { mutate: deleteTaskCall } = useDeleteTaskMutation();

  if (isTaskLoading) return <DetailPageSkeleton />;
  if (!taskData?.results[0]) return <div>Task not found</div>;

  return (
    <>
      <div className="space-y-8">
        <TitleDescription
          data={taskData?.results[0]}
          buttons={[
            <DeleteButton
              key="delete-button"
              title={taskData?.results[0].title}
              variant="destructive"
              onDelete={() => deleteTaskCall()}
            />,
          ]}
        />
        <DetailPageCards data={taskData?.results[0]} />
        <TaskButtons
          projectId={taskData.results[0].projectId}
          task={taskData?.results[0]}
        />
        {/* <FilterSort /> */}
        {isEventsLoading && <EventsSkeleton />}
        <EventsList events={eventsData?.results || []} />
      </div>
    </>
  );
}
