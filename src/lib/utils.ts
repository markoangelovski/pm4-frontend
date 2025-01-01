import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function prettyStatus(status: string) {
  return status
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export async function fetchWithAuth<T>(
  url: string,
  options?: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: T }
) {
  const { method = "GET", body } = options || {};

  const access = sessionStorage.getItem("access");

  if (!access) throw new Error("Access data missing");

  const parsedAccess = access && JSON.parse(access);

  if (
    !parsedAccess &&
    !parsedAccess.secret &&
    window.location.pathname !== "/login"
  )
    throw new Error("Access data malformed");

  type Payload = {
    method: string;
    headers: {
      "Content-Type"?: string;
      Authorization: string;
    };
    body?: string;
  };

  const payload: Payload = {
    method,
    headers: {
      Authorization: `Bearer ${parsedAccess.secret}`,
    },
  };

  if (method === "POST" || method === "PATCH") {
    payload.headers["Content-Type"] = "application/json";
    payload.body = JSON.stringify(body);
  }

  const res = await fetch(url, payload);

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error data:", errorData);
    throw new Error(
      errorData.errors[0].message || `HTTP error! status: ${res.status}`
    );
  }

  return res.json();
}
