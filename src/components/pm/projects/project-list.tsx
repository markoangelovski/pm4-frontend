"use client";

import { useState, useEffect, useMemo } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { Project } from "@/types";
import PixelArtCircle from "../common/PixelArtCircle";

// interface Project {
//   id: string;
//   title: string;
//   pl: string;
//   createdAt: Date;
//   modifiedAt: Date;
// }

// Sample project data
const projectsData: Project[] = [
  {
    id: uuidv4(),
    title: "Project A",
    description: "string",
    pl: "string",
    upcomingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    createdAt: new Date("2023-01-15"),
    modifiedAt: new Date("2023-06-20"),
  },
  {
    id: uuidv4(),
    title: "Project B",
    description: "string",
    pl: "string",
    upcomingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    createdAt: new Date("2023-02-28"),
    modifiedAt: new Date("2023-07-05"),
  },
  {
    id: uuidv4(),
    title: "Project C",
    description: "string",
    pl: "string",
    upcomingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    createdAt: new Date("2023-03-10"),
    modifiedAt: new Date("2023-08-12"),
  },
  {
    id: uuidv4(),
    title: "Project D",
    description: "string",
    pl: "string",
    upcomingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    createdAt: new Date("2023-04-22"),
    modifiedAt: new Date("2023-09-01"),
  },
  {
    id: uuidv4(),
    title: "Project E",
    description: "string",
    pl: "string",
    upcomingTasks: 0,
    inProgressTasks: 0,
    doneTasks: 0,
    createdAt: new Date("2023-05-07"),
    modifiedAt: new Date("2023-10-15"),
  },
];

export default function ProjectList({
  projectsData,
}: {
  projectsData: Project[];
}) {
  projectsData = projectsData.map((project) => {
    return {
      ...project,
      createdAt: new Date(project.createdAt),
      modifiedAt: new Date(project.modifiedAt),
    };
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParam = searchParams.get("f");
  const sortParam = searchParams.get("sort");

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projectsData];

    // Apply filtering
    if (filterParam) {
      const lowerFilter = filterParam.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerFilter) ||
          project.pl.toLowerCase().includes(lowerFilter)
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
            return a.createdAt.getTime() - b.createdAt.getTime();
          case "modified":
            return a.modifiedAt.getTime() - b.modifiedAt.getTime();
          default:
            return 0;
        }
      });
    }

    return result;
  }, [projectsData, filterParam, sortParam]);

  const handleProjectClick = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", projectId);
    router.push(`?${params.toString()}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Project Lead</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Modified At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAndSortedProjects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleProjectClick(project.id);
                }}
                className="text-blue-600 hover:underline flex items-center"
              >
                <PixelArtCircle input={project.id} />
                {project.title}
              </Link>
            </TableCell>
            <TableCell>{project.pl}</TableCell>
            <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>{project.modifiedAt.toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
