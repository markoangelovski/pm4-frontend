import {
  useDeleteProjectMutation,
  useProjectQuery,
} from "@/hooks/use-projects";
import ProjectButtons from "./project-button";
import TaskList from "../tasks/task-list";
import { useTasksQuery } from "@/hooks/use-tasks";
import StatusSelect from "../tasks/StatusSelect";
import FilterSort from "../common/filter-sort";
import { TaskButtons } from "../tasks/TaskButtons";
import TitleDescription from "../common/TitleDescription";
import { DetailPageSkeleton } from "../common/DetailPageSkeleton";
import DetailPageCards from "../common/DetailPageCards";
import { DeleteButton } from "../common/delete-button";
import PaginationComponent from "../pagination/PaginationComponent";

export default function ProjectDetailPage({
  projectId,
}: {
  projectId: string;
}) {
  const { data: projectData, isLoading: isProjectLoading } =
    useProjectQuery(projectId);
  const { data: tasksData, isLoading: isTasksLoading } = useTasksQuery();
  const { mutate: deleteProjectCall } = useDeleteProjectMutation();

  if (isProjectLoading) return <DetailPageSkeleton />;
  if (!projectData?.results[0]) return <div>Project not found</div>;

  return (
    <>
      <div className="space-y-8">
        <TitleDescription
          data={projectData?.results[0]}
          buttons={[
            <ProjectButtons
              key="project-buttons"
              project={projectData?.results[0]}
            />,
            <DeleteButton
              key="delete-button"
              title={projectData?.results[0].title}
              variant="destructive"
              onDelete={() => deleteProjectCall()}
            />,
          ]}
        />
        <DetailPageCards data={projectData?.results[0]} />
        <TaskButtons projectId={projectData.results[0].id} />
        <FilterSort />
        <StatusSelect />
        <TaskList
          isTasksLoading={isTasksLoading}
          tasksData={tasksData?.results || []}
        />
        <PaginationComponent
          limit={tasksData?.limit}
          offset={tasksData?.offset}
          totalResults={tasksData?.totalResults}
        />
      </div>
    </>
  );
}
