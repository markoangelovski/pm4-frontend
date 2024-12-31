import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { Project, Response, User } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const projectsPath = process.env.NEXT_PUBLIC_PROJECTS_PATH;

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: (): Promise<Response<Project>> =>
      fetchWithAuth(`${backendUrl}${projectsPath}`),
    retry: false,
  });
};
