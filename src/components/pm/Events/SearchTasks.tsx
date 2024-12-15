// import { useState, useEffect, useCallback, use } from "react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Switch } from "@/components/ui/switch";
// import { Search, ChevronDown, CalendarIcon, Plus } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { format, parseISO } from "date-fns";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { randomUUID } from "crypto";
// import { PmEvent, Task, TaskStatus } from "@/types";
// import { useUpdateQueryParam } from "@/hooks/use-helpers";
// import { useCreateTask, useSearchTasks } from "@/hooks/use-tasks";
// import { toast } from "@/hooks/use-toast";
// import { useGetProjects } from "@/hooks/use-projects";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useCreateEvent } from "@/hooks/use-events";
// // import { eventSchema, PmEventData } from "@/app/(routes)/events/page";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchTasks } from "@/hooks/use-tasks";
import { PmEvent, Task } from "@/types";
import { set } from "date-fns";
import { use, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

// // const eventSchema = z.object({
// //   title: z.string().min(1, "Title is required"),
// //   taskId: z.string().optional(),
// //   logTitle: z.string().min(1, "Log title is required"),
// //   duration: z.number().min(0).optional(),
// // });
// // export type PmEventData = z.infer<typeof eventSchema>;

// export default function EventForm2({
//   onSubmit,
//   initialData,
// }: {
//   onSubmit: (data: PmEventData) => void;
//   initialData?: Partial<PmEvent>;
// }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [isNewEventOpen, setIsNewEventOpen] = useState(false);

//   const {
//     data: tasksData,
//     isLoading: isTasksLoading,
//     error: tasksError,
//   } = useSearchTasks(searchQuery);

//   const {
//     mutate: createEvent,
//     isPending,
//     error: createEventError,
//   } = useCreateEvent();

//   const handleAddEvent = useCallback((data: PmEventData) => {
//     console.log("New Event data: ", data);
//     const newEvent = {
//       ...data,
//       id: "123",
//       createdAt: new Date(),
//       logs: [],
//       totalBooked: 0,
//       duration: data.duration ?? 0,
//     };
//     createEvent(newEvent, {
//       onSuccess: () => {
//         setIsNewEventOpen(false);
//         pmEventForm.reset();
//         toast({
//           title: "Event created successfully!",
//           description: "Your new event has been added.",
//           // variant: "success",
//         });
//       },
//       onError: (err) => {
//         toast({
//           title: "Error creating event",
//           description: err.message,
//           variant: "destructive",
//         });
//       },
//     });
//   }, []);

//   const pmEventForm = useForm<PmEventData>({
//     resolver: zodResolver(eventSchema),
//     defaultValues: initialData || { title: "", logTitle: "", duration: 0 },
//   });

//   const handleTaskClick = (task: Task) => {
//     setSelectedTask(task);
//     setSearchQuery(task.title);
//     pmEventForm.setValue("taskId", task.id);
//   };

//   return (
//     <Form {...pmEventForm}>
//       <form onSubmit={pmEventForm.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={pmEventForm.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {!initialData && (
//           <>
//             <FormField
//               control={pmEventForm.control}
//               name="logTitle"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Log Title</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={pmEventForm.control}
//               name="duration"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Log Duration</FormLabel>
//                   <FormControl>
//                     <Input type="number" step={0.25} min={0} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </>
//         )}

//         <FormField
//           name="taskId"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Task</FormLabel>
//               <FormField
//                 name="searchQuery"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Input
//                         {...field}
//                         value={searchQuery}
//                         onChange={(e) => {
//                           setSearchQuery(e.target.value);
//                           if (e.target.value === "") {
//                             pmEventForm.setValue("taskId", "");
//                             setSelectedTask(null);
//                           }
//                           field.onChange(e);
//                         }}
//                         placeholder="Search for tasks..."
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* <div className="flex flex-wrap gap-2 mt-2 w-full max-h-24 overflow-y-auto"> */}
//               <ScrollArea className="rounded-md  h-48 ">
//                 {isTasksLoading ? (
//                   <span>Loading...</span>
//                 ) : tasksError ? (
//                   <span>Error loading tasks</span>
//                 ) : (
//                   tasksData?.data?.map((task: Task) => (
//                     <div
//                       key={task.id}
//                       onClick={() => handleTaskClick(task)}
//                       className={`cursor-pointer px-2 py-1 mb-1 w-full border- ${
//                         selectedTask?.id === task.id && "bg-gray-200"
//                       }`}
//                     >
//                       {task.title}
//                     </div>
//                   ))
//                 )}
//               </ScrollArea>
//               {/* </div> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <DialogFooter>
//           <Button type="submit">
//             {initialData ? "Update Event" : "Add Event"}
//           </Button>
//         </DialogFooter>
//       </form>
//     </Form>
//   );
// }

export default function SearcTasks({
  initialData,
  pmEventForm,
  handleTaskClick,
}: {
  initialData?: Partial<PmEvent>;
  pmEventForm: UseFormReturn<{
    title: string;
    duration: number;
    logTitle?: string;
    taskId?: string | undefined;
  }>;
  handleTaskClick: (task: Task) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    error: tasksError,
  } = useSearchTasks(searchQuery);

  useEffect(() => {
    if (initialData) {
      setSelectedTask(initialData.task || null);
      setSearchQuery(initialData.task?.title || "");
    }
  }, []);

  return (
    <FormField
      name="taskId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Task</FormLabel>
          <FormField
            name="searchQuery"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Search for tasks..."
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value === "") {
                        pmEventForm.setValue("taskId", "");
                        setSelectedTask(null);
                      }
                      field.onChange(e);
                    }}
                    value={searchQuery}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ScrollArea className="rounded-md  h-48 ">
            {isTasksLoading ? (
              <span>Loading...</span>
            ) : tasksError ? (
              <span>Error loading tasks</span>
            ) : (
              tasksData?.data?.map((task: Task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setSearchQuery(task.title);
                    setSelectedTask(task);
                    handleTaskClick(task);
                  }}
                  className={`cursor-pointer px-2 py-1 mb-1 w-full border- ${
                    selectedTask?.id === task.id && "bg-gray-200"
                  }`}
                >
                  {task.title}
                </div>
              ))
            )}
          </ScrollArea>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
