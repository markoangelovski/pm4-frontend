import { createColor } from "@/lib/utils";
import { PmEvent } from "@/types";
import { FC, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

interface WorkedHoursChartProps {
  events: PmEvent[];
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      {/* Display title and duration below each other */}
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${payload.title}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${value}h`}
      </text>
    </g>
  );
};

const WorkedHoursChart: FC<WorkedHoursChartProps> = ({ events }) => {
  const data = events.map((event) => ({
    title: event.title,
    value: event.logs.reduce((sum, log) => sum + log.duration, 0),
    color: createColor(event.id),
  }));

  const MAX_DURATION = 8;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Calculate total duration
  const totalDuration = data.reduce((sum, event) => sum + event.value, 0);

  // Add the remainder segment
  const remainderDuration =
    totalDuration > MAX_DURATION
      ? totalDuration - MAX_DURATION
      : MAX_DURATION - totalDuration;

  const pieData = [
    ...data,
    {
      title: totalDuration > MAX_DURATION ? "Overtime" : "Pending",
      value: remainderDuration,
      color: totalDuration > MAX_DURATION ? "#8B0000" : "#d3d3d3",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* Total duration in the middle of the chart */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "16px", fontWeight: "bold" }}
        >
          {`${totalDuration.toFixed(2)}h / ${remainderDuration.toFixed(2)}h`}
        </text>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          onMouseEnter={(_, index) => setActiveIndex(index)}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default WorkedHoursChart;
