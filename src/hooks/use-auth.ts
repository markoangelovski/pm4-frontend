import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { LoginFormData } from "@/app/(auth)/login/page";
import { RegisterFormData } from "@/app/(auth)/register/page";
import { Response, User } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const userPath = process.env.NEXT_PUBLIC_USER_PATH;
const profilePath = process.env.NEXT_PUBLIC_USER_PROFILE_PATH;
const registerPath = process.env.NEXT_PUBLIC_USER_REGISTER_PATH;
const loginPath = process.env.NEXT_PUBLIC_USER_LOGIN_PATH;

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: (): Promise<Response<User>> =>
      fetchWithAuth(`${backendUrl}${userPath}`),
    retry: false,
  });
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => fetchWithAuth(`${backendUrl}${profilePath}`),
    retry: false,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (registerData: RegisterFormData) => {
      const response = await fetch(`${backendUrl}${registerPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    },
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
