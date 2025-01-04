import { ProjectFromServer, TaskFromServerWithProject } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CalendarSync,
  CheckCircle,
  Clock,
  FolderKanban,
  Link2,
  UserRoundCogIcon,
} from "lucide-react";
import Link from "next/link";
import PixelArtCircle from "./PixelArtCircle";
import { useRouter, useSearchParams } from "next/navigation";

interface DetailPageCardsProps {
  data: ProjectFromServer | TaskFromServerWithProject;
}

export default function DetailPageCards({ data }: DetailPageCardsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = "projectId" in data ? "task" : "project";

  // Helper function to render task status
  const renderTaskStatus = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Upcoming</span>
            </div>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">In Progress</span>
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Done</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleProjectClick = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", projectId);
    router.push(`/projects?${params.toString()}&status=in-progress`);
  };

  const handlePlClick = (pl: string) => {
    if (type === "project") {
      router.push(`/projects?status=in-progress&pl=${pl}`);
    } else {
      router.push(`/tasks?status=in-progress&pl=${pl}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Details Section */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">
          {type === "project" ? "Project" : "Task"} Details
        </h2>
        <div className="space-y-2">
          {type === "task" && "project" in data && (
            <div className="flex items-center space-x-2 text-gray-600">
              <FolderKanban className="w-5 h-5" />
              <span className="flex items-center ">
                Project:{" "}
                {
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProjectClick(data.projectId);
                    }}
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <PixelArtCircle input={data.projectId} className="mx-2" />
                    {data.project.title}
                  </Link>
                }
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-600">
            <UserRoundCogIcon className="w-5 h-5" />
            <span>
              Project Lead:{" "}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePlClick(data.pl);
                }}
                className="text-blue-600 hover:underline"
              >
                {data.pl}
              </Link>
            </span>
          </div>
          {type === "task" && "jiraLink" in data && data.jiraLink && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Link2 className="w-5 h-5" />
              <span>
                Link:{" "}
                <Link
                  href={data.jiraLink}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {data.jiraLink}
                </Link>
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>
              Created: {format(data.createdAt || "", "MMMM LL, yyyy")}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>
              Last Modified: {format(data.createdAt || "", "MMMM LL, yyyy")}
            </span>
          </div>
          {type === "task" && "dueDate" in data && data.dueDate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <CalendarSync className="w-5 h-5" />
              <span>Due Date: {format(data.dueDate, "MMMM LL, yyyy")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Overview Section */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">
          {type === "project" ? "Tasks Overview" : "Status"}
        </h2>
        {type === "project" && "upcomingTasks" in data ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Upcoming</span>
              </div>
              <span className="font-semibold text-gray-900">
                {data.upcomingTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">In Progress</span>
              </div>
              <span className="font-semibold text-gray-900">
                {data.inProgressTasks}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Done</span>
              </div>
              <span className="font-semibold text-gray-900">
                {data.doneTasks}
              </span>
            </div>
          </div>
        ) : (
          "status" in data && renderTaskStatus(data.status)
        )}
      </div>
    </div>
  );
}
