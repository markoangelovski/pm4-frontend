import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { LoginFormData } from "@/app/login/page";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const loginPath = process.env.NEXT_PUBLIC_USER_LOGIN_PATH;
const profilePath = process.env.NEXT_PUBLIC_USER_PROFILE_PATH;

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => fetchWithAuth(`${backendUrl}${profilePath}`),
    retry: false,
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (loginData: LoginFormData) => {
      const response = await fetch(`${backendUrl}${loginPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    },
  });
};

export const logout = () => {
  // Logout logic here
};
