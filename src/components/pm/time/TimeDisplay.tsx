"use client";

import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDaysSingleQuery, useEditDayMutation } from "@/hooks/use-events";
import { Skeleton } from "@/components/ui/skeleton";
import { AlarmClock, Clock, Edit2, Play } from "lucide-react";

const formatTime = (time: number): string => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

interface TimeDisplayProps {
  workedDuration: number;
}

export default function TimeDisplay({ workedDuration }: TimeDisplayProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: dayData, isLoading, error } = useDaysSingleQuery();
  const editDayMutation = useEditDayMutation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now.getHours() + now.getMinutes() / 60));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dayData?.results[0]) {
      const totalTime = dayData.results[0].start + workedDuration;
      setValueC(formatTime(totalTime));
    }
  }, [workedDuration, dayData]);

  const [valueB, setValueB] = useState<number>(0);
  const [valueC, setValueC] = useState<string>("");

  useEffect(() => {
    if (dayData?.results[0]) {
      setValueB(dayData.results[0].start);
    }
  }, [dayData]);

  const handleValueBClick = () => {
    setIsEditing(true);
  };

  const handleValueBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueB(parseFloat(e.target.value));
  };

  const handleValueBBlur = () => {
    setIsEditing(false);
    if (dayData?.results[0]) {
      editDayMutation.mutate({ id: dayData.results[0].id, start: valueB });
    }
  };

  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="inline-flex items-center space-x-4 px-2 py-1.5 bg-background rounded-md border border-input">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-400" />
        <div>{currentTime}</div>
      </div>
      <div className="text-muted-foreground">|</div>
      <div className="flex items-center space-x-2 cursor-pointer">
        <Play className="h-4 w-4 text-gray-400" />
        {isEditing ? (
          <input
            type="number"
            value={valueB}
            onChange={handleValueBChange}
            onBlur={handleValueBBlur}
            step={0.25}
            min={0}
            max={24}
            className="bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        ) : (
          <>
            <span onClick={handleValueBClick}>{formatTime(valueB)}</span>
            <Edit2 className="w-3 h-3 inline-block ml-2 text-gray-500" />
          </>
        )}
      </div>
      <div className="text-muted-foreground">|</div>
      <div className="flex items-center space-x-2">
        <AlarmClock className="h-4 w-4 text-gray-400" />
        {isLoading ? (
          <Skeleton className="w-10 h-4 rounded" />
        ) : (
          <div>{valueC}</div>
        )}
      </div>
    </div>
  );
}

/**
 *   return (
    <div className="inline-flex flex items-center space-x-4 ">
      <div className="">{currentTime}</div>
      <div className="">|</div>
      <div className="cursor-pointer">
        {isEditing ? (
          <input
            type="number"
            value={valueB}
            onChange={handleValueBChange}
            onBlur={handleValueBBlur}
            step={0.25}
            min={0}
            max={24}
            className=""
          />
        ) : (
          <span onClick={handleValueBClick}>{formatTime(valueB)}</span>
        )}
      </div>
      <div className="">|</div>
      {isLoading ? (
        <Skeleton className="w-10 h-4 rounded" />
      ) : (
        <div className="">{valueC}</div>
      )}
    </div>
  );
 */
