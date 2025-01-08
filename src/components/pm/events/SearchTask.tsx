"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasksQuery } from "@/hooks/use-tasks";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const tasksQuery = useTasksQuery();

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      newParams.set("q", searchTerm);
    } else {
      newParams.delete("q");
    }
    router.push(`?${newParams.toString()}`, { scroll: false });
  }, [searchTerm, router, searchParams]);

  useEffect(() => {
    if (searchTerm === "") {
      setSelectedTaskId(undefined);
      onSelect(undefined);
    }
  }, [searchTerm, onSelect]);

  useEffect(() => {
    if (initialTaskTitle && tasksQuery.data) {
      const initialTask = tasksQuery.data.results.find(
        (task) => task.title === initialTaskTitle
      );
      if (initialTask) {
        setSelectedTaskId(initialTask.id);
        onSelect(initialTask.id);
      }
    }
  }, [initialTaskTitle, tasksQuery.data, onSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (newValue === "") {
      setSelectedTaskId(undefined);
      onSelect(undefined);
    }
  };

  const handleSelectChange = (taskId: string) => {
    const selectedTask = tasksQuery.data?.results?.find(
      (task) => task.id === taskId
    );
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
      {tasksQuery.data && tasksQuery.data.results.length > 0 && (
        <Select onValueChange={handleSelectChange} value={selectedTaskId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {tasksQuery.data.results.map((task) => (
              <SelectItem key={task.id} value={task.id}>
                {task.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
