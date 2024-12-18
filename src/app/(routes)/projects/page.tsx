"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import ProjectDetail from "@/components/pm/Projects/ProjectDetail";
import Header from "@/components/pm/Header/Header";
import { useGetProjects } from "@/hooks/use-projects";
import { format } from "date-fns";
import ProjectSortNew from "@/components/pm/Projects/ProjectSortNew";
import { toast } from "@/hooks/use-toast";
import { Project } from "@/types";
import TableSkeleton from "@/components/pm/Projects/TableSkeleton";
import { useUpdateQueryParam } from "@/hooks/use-helpers";

function ProjectsComponent() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = useUpdateQueryParam();

  const { data: projectsData, isLoading, error } = useGetProjects();
  const [filteredProjects, setFilteredProjects] = useState<
    Project[] | undefined
  >([]);
  const [reRender, setReRender] = useState(false);

  const handleSort = (sortType: string | null) => {
    if (!projectsData?.data) return;

    switch (sortType) {
      case "title":
        projectsData?.data?.sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        );
        break;
      case "newest":
        projectsData?.data?.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );
        break;
      case "oldest":
        projectsData?.data?.sort(
          (a, b) =>
            new Date(a.createdAt || "").getTime() -
            new Date(b.createdAt || "").getTime()
        );
        break;
      case "updated":
        projectsData?.data?.sort(
          (a, b) =>
            new Date(b.modifiedAt || b.createdAt || "").getTime() -
            new Date(a.modifiedAt || a.createdAt || "").getTime()
        );
        break;
    }
    setReRender(!reRender);
  };

  const handleFilter = (filter: string | null) => {
    if (filter === null || filter === "") {
      setFilteredProjects([]);
    } else {
      const filteredProjects = projectsData?.data?.filter((project) =>
        project.title.toLowerCase().includes(filter.toLowerCase())
      );
      filteredProjects?.length && setFilteredProjects(filteredProjects);
    }
  };

  useEffect(() => {
    const filterType = searchParams.get("q");
    handleFilter(filterType);

    const sortType = new URLSearchParams(searchParams).get("sort");
    sortType && handleSort(sortType);
  }, [searchParams, projectsData?.data]);

  useEffect(() => {
    if (error || projectsData?.hasErrors) {
      toast({
        title: error?.name || "Error loading projects",
        description: error?.message || projectsData?.message,
        variant: "destructive",
      });
    }
  }, [error, projectsData]);

  const projectId = searchParams.get("projectId");

  if (projectId) return <ProjectDetail />;

  return (
    <>
      <Header breadcrumbs={["Projects"]} />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <ProjectSortNew />

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Program Lead</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Modified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableSkeleton />}
                {filteredProjects?.length
                  ? filteredProjects?.map((project) => (
                      <Row
                        key={project.id}
                        project={project}
                        link={() =>
                          updateQueryParam("projectId", project.id || "")
                        }
                      />
                    ))
                  : projectsData?.data?.map((project) => (
                      <Row
                        key={project.id}
                        project={project}
                        link={() =>
                          updateQueryParam("projectId", project.id || "")
                        }
                      />
                    ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function Projects() {
  return <ProjectsComponent />;
}

function Row({ project, link }: { project: Project; link: () => void }) {
  return (
    <TableRow>
      <TableCell className="font-medium cursor-pointer" onClick={link}>
        {project.title}
      </TableCell>
      <TableCell>{project.pl}</TableCell>
      <TableCell>
        {project.upcomingTasks ||
          0 + (project.inProgressTasks || 0) + (project.doneTasks || 0)}
      </TableCell>
      <TableCell>{format(project.createdAt || "", "dd.MM.yyyy")}</TableCell>
      <TableCell>{format(project.modifiedAt || "", "dd.MM.yyyy")}</TableCell>
    </TableRow>
  );
}
