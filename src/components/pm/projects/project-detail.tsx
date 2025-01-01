import React from "react";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useProjectQuery } from "@/hooks/use-projects";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailPage({
  projectId,
}: {
  projectId: string;
}) {
  const { data: projectData, isLoading } = useProjectQuery(projectId);

  if (isLoading) return <ProjectDetailSkeleton />;
  if (!projectData?.results[0]) return <div>No project found</div>;

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900">
          {projectData?.results[0].title}
        </h1>
        <p className="text-gray-600">{projectData?.results[0].description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Project Details</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>
                Created:
                {format(
                  projectData?.results[0].createdAt || "",
                  "MMMM LL, yyyy"
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>
                Last Modified:{" "}
                {format(
                  projectData?.results[0].createdAt || "",
                  "MMMM LL, yyyy"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Task Overview</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Upcoming</span>
              </div>
              <span className=" font-semibold text-gray-900">
                {projectData?.results[0].upcomingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">In Progress</span>
              </div>
              <span className=" font-semibold text-gray-900">
                {projectData?.results[0].inProgressTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Done</span>
              </div>
              <span className=" font-semibold text-gray-900">
                {projectData?.results[0].doneTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-6 w-[250px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <Skeleton className="h-40 " />
        </div>
        <div className="">
          <Skeleton className="h-40 " />
        </div>
      </div>
    </div>
  );
}
