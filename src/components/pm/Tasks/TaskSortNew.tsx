import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronDown, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { randomUUID } from "crypto";
import { Task, TaskStatus } from "@/types";
import { useUpdateQueryParam } from "@/hooks/use-helpers";
import NewTaskBtn from "./TaskSortNew/NewTaskBtn";

const TaskSortNew = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = useUpdateQueryParam();

  const taskStatus = searchParams.get("status");

  useEffect(() => {
    if (!taskStatus) {
      updateQueryParam("status", "in-progress");
    }
  }, [router, pathName, searchParams, taskStatus]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-1/2 flex items-center">
          <div className="flex items-center border border-gray-200 px-2 py-1 rounded-md w-full">
            <Search className="text-gray-400" />
            <Input
              type="text"
              placeholder="Find task"
              className="w-full border-none"
              value={searchParams.get("q") || ""}
              onChange={(e) => updateQueryParam("q", e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "title")}
              >
                By Title
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "newest")}
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "updated")}
              >
                Last Updated
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => updateQueryParam("sort", "due-date")}
              >
                By Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => updateQueryParam("sort", "pl")}>
                By Program Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <NewTaskBtn />
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="upcoming"
            checked={searchParams.get("status")?.includes("upcoming") || false}
            onCheckedChange={() => updateQueryParam("status", "upcoming")}
            className="scale-75"
          />
          <label htmlFor="upcoming" className="text-sm cursor-pointer">
            Upcoming
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="in-progress"
            defaultChecked={true}
            checked={
              searchParams.get("status")?.includes("in-progress") || false
            }
            onCheckedChange={() => updateQueryParam("status", "in-progress")}
            className="scale-75"
          />
          <label htmlFor="in-progress" className="text-sm cursor-pointer">
            In Progress
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="done"
            checked={searchParams.get("status")?.includes("done") || false}
            onCheckedChange={() => updateQueryParam("status", "done")}
            className="scale-75"
          />
          <label htmlFor="done" className="text-sm cursor-pointer">
            Done
          </label>
        </div>
      </div>
    </>
  );
};

export default TaskSortNew;
