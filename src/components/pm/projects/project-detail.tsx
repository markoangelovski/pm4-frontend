"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
  upcomingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
}

// Mock data for a project
const projectData: Project = {
  id: "1",
  title: "Project Alpha",
  description:
    "This is a detailed description of Project Alpha. It includes the project goals, main objectives, and expected outcomes.",
  createdAt: new Date("2023-01-15"),
  modifiedAt: new Date("2023-06-20"),
  upcomingTasks: 5,
  inProgressTasks: 3,
  doneTasks: 7,
};

export default function ProjectDetail() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  // In a real application, you would fetch the project data based on the projectId
  // For this example, we'll use the mock data regardless of the projectId

  if (!projectId) {
    return <div>No project selected</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{projectData.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>{projectData.description}</p>
          <div className="flex flex-col space-y-2">
            <div>
              <span className="font-semibold">Created:</span>{" "}
              {projectData.createdAt.toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Last Modified:</span>{" "}
              {projectData.modifiedAt.toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Upcoming: {projectData.upcomingTasks}
            </Badge>
            <Badge variant="secondary">
              In Progress: {projectData.inProgressTasks}
            </Badge>
            <Badge variant="secondary">Done: {projectData.doneTasks}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
