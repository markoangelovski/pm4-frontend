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

const sortOptions = [
  { label: "Default", value: "default" },
  { label: "Title", value: "title" },
  { label: "Project Lead", value: "pl" },
  { label: "Created", value: "created" },
  { label: "Modified", value: "modified" },
];

export default function FilterSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filter, setFilter] = useState(() => searchParams?.get("f") || "");
  const [sort, setSort] = useState(() => searchParams?.get("sort") || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (filter) {
        params.set("f", filter);
      } else {
        params.delete("f");
      }
      if (sort && sort !== "default") {
        params.set("sort", sort);
      } else {
        params.delete("sort");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [filter, sort, router]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={handleFilterChange}
          className="w-full"
        />
      </div>
      <div className="w-full sm:w-48">
        <Select value={sort} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
