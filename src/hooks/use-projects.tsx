import { fetchWithAuth } from "@/lib/utils";
import { ApiResponse, Project } from "@/types";
import { useQuery } from "@tanstack/react-query";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const backendUrl1 = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL1;
const projectsPath = process.env.NEXT_PUBLIC_PROJECTS_PATH;
const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;

export const useGetProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: (): Promise<ApiResponse<Project[]>> =>
      fetch(`${backendUrl}${projectPath}?id=${projectId}`).then((res) =>
        res.json()
      ),
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<ApiResponse<Project>> => {
      return fetchWithAuth(`${backendUrl1}${projectsPath}`);
    },
  });
};
