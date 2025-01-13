import { Stat } from "@/types";
import StatItem from "./StatItem";

interface StatsListProps {
  stats: Stat[] | undefined;
}

export default function StatsList({ stats }: StatsListProps) {
  if (!stats || stats.length === 0) {
    return <div className="text-center py-8">No stats available.</div>;
  }

  return (
    <div className="space-y-8">
      {stats.map((stat) => (
        <StatItem key={stat.day} stat={stat} />
      ))}
    </div>
  );
}
