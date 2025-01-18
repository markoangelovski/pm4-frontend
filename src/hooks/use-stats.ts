import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "../lib/utils";
import { Response, Stat } from "@/types";
import { useSearchParams } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_ROOT_URL;
const statsPath = process.env.NEXT_PUBLIC_STATS_PATH;

export const useStatsQuery = () => {
  const url = new URL(`${backendUrl}${statsPath}`);
  const searchParams = useSearchParams();

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (start) url.searchParams.append("start", start);
  if (end) url.searchParams.append("end", end);

  return useQuery({
    queryKey: ["stats", { start, end }],
    queryFn: (): Promise<Response<Stat>> => fetchWithAuth(url.toString()),
    retry: false,
  });
};
