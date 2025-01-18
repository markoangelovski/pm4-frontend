"use client";

import DayRangePicker from "@/components/pm/common/DayRangePicker";
import StatsList from "@/components/pm/stats/StatsList";
import { useStatsQuery } from "@/hooks/use-stats";

export default function Stats() {
  const { data: statsData, isLoading: isStatsLoading } = useStatsQuery();
  // TODO: create skeleton for loading stats
  return (
    <div className="space-y-4">
      <div className="flex">
        <DayRangePicker />
      </div>
      {isStatsLoading && <div>Loading...</div>}
      {!isStatsLoading && !statsData && <div>No data available.</div>}
      <StatsList stats={statsData?.results || []} />
    </div>
  );
}
