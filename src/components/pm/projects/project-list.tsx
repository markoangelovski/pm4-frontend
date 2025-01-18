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
import { Project, ProjectFromServer } from "@/types";
import PixelArtCircle from "../common/PixelArtCircle";
import { format } from "date-fns";

export default function ProjectList({
  projectsData,
}: {
  projectsData: ProjectFromServer[];
}) {
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
  }, [projectsData, filterParam, sortParam]);

  const handleProjectClick = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", projectId);
    router.push(`?${params.toString()}&status=in-progress`);
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
                <PixelArtCircle input={project.id} className="mr-2" />
                {project.title}
              </Link>
            </TableCell>
            <TableCell>{project.pl}</TableCell>
            <TableCell>{format(project.createdAt, "MMMM dd, yyyy")}</TableCell>
            <TableCell>{format(project.modifiedAt, "MMMM dd, yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
