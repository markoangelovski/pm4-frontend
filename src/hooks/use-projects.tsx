import { ApiResponse, Project } from "@/types";
import { useQuery } from "@tanstack/react-query";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const projectsPath = process.env.NEXT_PUBLIC_PROJECTS_PATH;
const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<ApiResponse<Project[]>> =>
      fetch(`${backendUrl}${projectsPath}`).then((res) => res.json())
  });
};

export const useGetProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: (): Promise<ApiResponse<Project[]>> =>
      fetch(`${backendUrl}${projectPath}?id=${projectId}`).then((res) =>
        res.json()
      )
  });
};
