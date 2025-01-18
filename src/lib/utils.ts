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

export function groupDatesByMonth(dates: string[]): Record<string, Date[]> {
  return dates.reduce((acc, dateString) => {
    const date = new Date(dateString);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(date);
    return acc;
  }, {} as Record<string, Date[]>);
}

/**
 * Generate a hex color code from a UUID.
 * @param uuid - A string representing a valid UUID.
 * @returns A string representing a hex color code in the format "#RRGGBB".
 * @throws Error if the input is not a valid UUID.
 */
export function createColor(uuid: string): string {
  // Regular expression to validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // Validate the UUID input
  if (!uuidRegex.test(uuid)) {
    throw new Error("Invalid UUID format");
  }

  // Split the UUID into its sections
  const sections = uuid.split("-");

  // Use the first, third, and fifth sections to calculate RGB
  const red = parseInt(sections[0].slice(0, 2), 16); // First two characters of the first section
  const green = parseInt(sections[2].slice(0, 2), 16); // First two characters of the third section
  const blue = parseInt(sections[4].slice(0, 2), 16); // First two characters of the fifth section

  // Format as a hex color code
  const color = `#${red.toString(16).padStart(2, "0")}${green
    .toString(16)
    .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;

  return color.toUpperCase(); // Return uppercase hex color
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
