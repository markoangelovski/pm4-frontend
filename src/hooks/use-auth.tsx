import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, User } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL1;
const loginPath = process.env.NEXT_PUBLIC_USER_LOGIN_PATH;

export const useLogin = () => {
  const router = useRouter(); // Import and use useRouter

  const searchParams = useSearchParams();
  const cb = searchParams.get("cb");

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: User): Promise<ApiResponse<User>> => {
      const response = await fetch(`${backendUrl}${loginPath}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || response.statusText;
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      sessionStorage.setItem("access", JSON.stringify(data.data[0]));
      const redirectUrl = cb ? decodeURIComponent(cb) : "/";
      router.push(redirectUrl);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};
