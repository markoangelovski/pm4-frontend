"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchTaskQuery } from "@/hooks/use-tasks";

interface SearchTaskProps {
  onSelect: (taskId: string | undefined) => void;
  value?: string;
  initialTaskTitle?: string;
}

export default function SearchTask({
  onSelect,
  value,
  initialTaskTitle,
}: SearchTaskProps) {
  const [searchTerm, setSearchTerm] = useState(initialTaskTitle || "");
  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(
    value
  );

  const { data: tasksData, isLoading } = useSearchTaskQuery(searchTerm);

  useEffect(() => {
    if (searchTerm === "") {
      setSelectedTaskId(undefined);
      onSelect(undefined);
    }
  }, [searchTerm, onSelect]);

  useEffect(() => {
    if (initialTaskTitle && tasksData) {
      const initialTask = tasksData.results.find(
        (task) => task.title === initialTaskTitle
      );
      if (initialTask) {
        setSelectedTaskId(initialTask.id);
        onSelect(initialTask.id);
      }
    }
  }, [initialTaskTitle, tasksData, onSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (newValue === "") {
      setSelectedTaskId(undefined);
      onSelect(undefined);
    }
  };

  const handleSelectChange = (taskId: string) => {
    const selectedTask = tasksData?.results?.find((task) => task.id === taskId);
    if (selectedTask) {
      setSearchTerm(selectedTask.title);
      setSelectedTaskId(taskId);
      onSelect(taskId);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      {!isLoading && tasksData && tasksData.results.length > 0 && (
        <Select onValueChange={handleSelectChange} value={selectedTaskId}>
          <SelectTrigger>
            <SelectValue
              placeholder={`Available: ${tasksData.results.length}`}
            />
          </SelectTrigger>
          <SelectContent>
            {tasksData.results.length > 0 ? (
              tasksData.results.map((task) => (
                <SelectItem key={task.id} value={task.id}>
                  {task.title}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No tasks found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
