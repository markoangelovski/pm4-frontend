"use client";

import { useState, useEffect } from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";
import Header from "@/components/pm/Header/Header";

// Mock API functions
const fetchHoursWorked = async (start: Date, end: Date): Promise<number> =>
  Math.floor(Math.random() * 100) + 50;
const fetchHoursBooked = async (start: Date, end: Date): Promise<number> =>
  Math.floor(Math.random() * 100) + 30;
const fetchMissingHours = async (start: Date, end: Date): Promise<number> =>
  Math.floor(Math.random() * 10);
const fetchOvertime = async (start: Date, end: Date): Promise<number> =>
  Math.floor(Math.random() * 10);
const fetchDailyData = async (
  start: Date,
  end: Date
): Promise<Array<{ date: string; startTime: string; hoursWorked: number }>> => {
  return eachDayOfInterval({ start, end }).map((date) => ({
    date: format(date, "yyyy-MM-dd"),
    startTime: `${8 + Math.floor(Math.random() * 2)}:${Math.floor(
      Math.random() * 60
    )
      .toString()
      .padStart(2, "0")}`,
    hoursWorked: 5 + Math.random() * 5,
  }));
};

const formatHours = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}min`;
};

export default function Home() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [hoursWorked, setHoursWorked] = useState(0);
  const [hoursBooked, setHoursBooked] = useState(0);
  const [missingHours, setMissingHours] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [dailyData, setDailyData] = useState<
    Array<{ date: string; startTime: string; hoursWorked: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      if (dateRange.from && dateRange.to) {
        try {
          const [worked, booked, missing, over, daily] = await Promise.all([
            fetchHoursWorked(dateRange.from, dateRange.to),
            fetchHoursBooked(dateRange.from, dateRange.to),
            fetchMissingHours(dateRange.from, dateRange.to),
            fetchOvertime(dateRange.from, dateRange.to),
            fetchDailyData(dateRange.from, dateRange.to),
          ]);
          setHoursWorked(worked);
          setHoursBooked(booked);
          setMissingHours(missing);
          setOvertime(over);
          setDailyData(daily);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("An error occurred while fetching data. Please try again.");
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dateRange]);

  const totalWorkingDays =
    dateRange.from && dateRange.to
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to }).filter(
          (day) => !isWeekend(day)
        ).length
      : 0;
  const totalHours = totalWorkingDays * 7.5;

  const renderPieChart = (title: string, value: number, total: number) => (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: title, value: value },
                    { name: "Remaining", value: Math.max(0, total - value) },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={45}
                  startAngle={90}
                  endAngle={-270}
                  fill="#8884d8"
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell key="cell-0" fill="#22c55e" />
                  <Cell key="cell-1" fill="#f3f4f6" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{formatHours(value)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header breadcrumbs={["Dashboard"]} />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(newDateRange) =>
                  setDateRange(
                    newDateRange || {
                      from: startOfMonth(new Date()),
                      to: endOfMonth(new Date()),
                    }
                  )
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-destructive">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {renderPieChart("Worked", hoursWorked, totalHours)}
              {renderPieChart("Booked", hoursBooked, hoursWorked)}

              <Card>
                <CardHeader>
                  <CardTitle>Missing Hours vs Overtime</CardTitle>
                </CardHeader>
                <CardContent>
                  {(missingHours > 0 || overtime > 0) && (
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Hours",
                              missing: missingHours,
                              overtime: overtime,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="missing"
                            fill="hsl(var(--destructive))"
                            name="Missing"
                          />
                          <Bar
                            dataKey="overtime"
                            fill="hsl(var(--primary))"
                            name="Overtime"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Hours</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData.length > 0 && (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={dailyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="hours" />
                        <YAxis yAxisId="time" orientation="right" />
                        <Tooltip />
                        <Bar
                          yAxisId="hours"
                          dataKey="hoursWorked"
                          name="Hours Worked"
                        >
                          {dailyData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.hoursWorked < 7.5 ? "#22c55e" : "#3b82f6"
                              }
                            />
                          ))}
                        </Bar>
                        <Line
                          yAxisId="time"
                          type="monotone"
                          dataKey="startTime"
                          stroke="#ff7300"
                          name="Start Time"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
