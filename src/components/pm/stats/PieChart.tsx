import { PieChart as RechartsChart, Pie, Cell } from "recharts";

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
  size: number;
}

export default function PieChart({ data, size }: PieChartProps) {
  return (
    <RechartsChart width={size} height={size}>
      <Pie
        data={data}
        cx={size / 2}
        cy={size / 2}
        innerRadius={size / 3}
        outerRadius={size / 2}
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </RechartsChart>
  );
}
