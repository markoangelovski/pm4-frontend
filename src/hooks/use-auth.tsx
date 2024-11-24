import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ApiResponse, User } from "@/types";
import { fetchWithAuth } from "@/lib/utils";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL1;
const loginPath = process.env.NEXT_PUBLIC_USER_LOGIN_PATH;
const authPath = process.env.NEXT_PUBLIC_USER_AUTH_PATH;

export const useLogin = () => {
  const router = useRouter();
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
      router.replace(redirectUrl); // Use replace to avoid history stack issues
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Consider adding a more user-friendly error message
    },
  });
};

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: (): Promise<ApiResponse<User[]>> => {
      // const access = window.sessionStorage.getItem("access");
      // const accessParsed = access ? JSON.parse(access) : null;
      // if (!accessParsed)
      //   return Promise.resolve({
      //     hasErrors: true,
      //     statusCode: 401,
      //     message: "Unauthorized",
      //     data: [],
      //   });

      return fetchWithAuth(`${backendUrl}${authPath}`);

      // return fetch(`${backendUrl}${authPath}`, {
      //   headers: {
      //     Authorization: `Bearer ${accessParsed.secret}`,
      //   },
      // }).then((res) => res.json());
    },
  });
};
