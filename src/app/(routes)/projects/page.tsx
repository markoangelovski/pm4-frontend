"use client";

import { useProjectsQuery } from "@/hooks/use-projects";
import FilterSort from "@/components/pm/common/filter-sort";
import ProjectList from "@/components/pm/projects/project-list";
import { useSearchParams } from "next/navigation";
import ProjectDetailPage from "@/components/pm/projects/project-detail";
import ProjectButtons from "@/components/pm/projects/project-button";
import PaginationComponent from "@/components/pm/pagination/PaginationComponent";

export default function Projects() {
  const { data: projectsData } = useProjectsQuery();

  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");

  if (projectId) return <ProjectDetailPage projectId={projectId} />;
  console.log("projectsData: ", projectsData);
  return (
    <>
      <ProjectButtons />
      <FilterSort />
      <ProjectList projectsData={projectsData?.results || []} />
      <PaginationComponent
        limit={projectsData?.limit}
        offset={projectsData?.offset}
        totalResults={projectsData?.totalResults}
      />
    </>
  );
}
