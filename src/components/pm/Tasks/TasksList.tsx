import { useState, useEffect, Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ExternalLink,
  Search,
  ChevronDown,
  PlusCircle,
  CheckCircle,
  Edit,
  Trash2,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  ArrowLeft,
  CalendarIcon
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  formatDistanceToNow,
  isFuture,
  isPast,
  parseISO
} from "date-fns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import NextLink from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { mockNotes } from "@/mocks";
// import { Note, Task, TaskStatus } from "@/types";
import { Note, Task, TaskStatus } from "@/types";
import TaskSortNew from "./TaskSortNew";
import TasksListRow from "./TasksListRow";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  pl: z.string().min(1, "Program lead is required"),
  jiraLink: z.string().url("Invalid Jira link"),
  dueDate: z.date(),
  status: z.enum(["upcoming", "in-progress", "done"])
});

const noteSchema = z.object({
  content: z.string().min(1, "Note text is required")
});

type TaskFormData = z.infer<typeof taskSchema>;
type NoteFormData = z.infer<typeof noteSchema>;

const TasksList = ({ tasksList }: { tasksList?: Task[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  console.log("taskslist: ", tasksList);

  // const [project, setProject] = useState<Project>(mockProject);
  const [tasks, setTasks] = useState<Task[]>(tasksList || []);
  // const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasksList || []);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isMarkCompletedOpen, setIsMarkCompletedOpen] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newNoteTaskId, setNewNoteTaskId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState<string | null>(null);

  const taskForm = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      pl: "",
      jiraLink: "",
      dueDate: new Date(),
      status: "upcoming"
    }
  });

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: ""
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false
      })
    ],
    content: ""
  });

  useEffect(() => {
    const status = searchParams.get("status");
    const searchQuery = searchParams.get("q") || "";
    const sortBy = searchParams.get("sort") || "";

    filterAndSortTasks(status, searchQuery, sortBy);
  }, [searchParams, tasks]);

  const filterAndSortTasks = (
    status: string | null,
    searchQuery: string,
    sortBy: string
  ) => {
    const filtered = tasks.filter(
      (task) =>
        (!status || status.split(",").includes(task.status)) &&
        (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.pl.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "due-date":
        filtered.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        break;
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "pl":
        filtered.sort((a, b) => a.pl.localeCompare(b.pl));
        break;
    }

    setFilteredTasks(filtered);
  };

  const updateQueryParams = (params: Record<string, string | boolean>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === false || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    router.push(`?${newParams.toString()}`);
  };

  const handleStatusToggle = (status: TaskStatus) => {
    const currentStatus = searchParams.get("status");
    let newStatus: string[];

    if (currentStatus) {
      newStatus = currentStatus.split(",");
      const index = newStatus.indexOf(status);
      if (index > -1) {
        newStatus.splice(index, 1);
      } else {
        newStatus.push(status);
      }
    } else {
      newStatus = [status];
    }

    if (newStatus.length > 0) {
      updateQueryParams({ status: newStatus.join(",") });
    } else {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("status");
      router.push(`?${newParams.toString()}`);
    }
  };

  const handleSearch = (query: string) => {
    updateQueryParams({ q: query });
  };

  const handleSort = (sortType: string) => {
    updateQueryParams({ sort: sortType });
  };

  const handleNewTask = (projectId: string, data: TaskFormData) => {
    const newTask: Task = {
      ...data,
      id: "51663d9e-2ac2-46ae-b336-f9325dd4eb6b",
      projectId: projectId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks([...tasks, newTask]);
    setIsNewTaskOpen(false);
    taskForm.reset();
  };

  const handleMarkCompleted = () => {
    if (selectedTask) {
      const updatedTask: Task = {
        ...selectedTask,
        status: "done",
        updatedAt: new Date()
      };
      setTasks(
        tasks.map((task) => (task.id === selectedTask.id ? updatedTask : task))
      );
      setIsMarkCompletedOpen(false);
      setSelectedTask(null);
    }
  };

  const handleNewNote = (data: NoteFormData) => {
    if (newNoteTaskId) {
      const newNote: Note = {
        id: "51663d9e-2ac2-46ae-b336-f9325dd4eb6b",
        taskId: newNoteTaskId,
        content: data.content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // setNotes([...notes, newNote]);
      setNewNoteTaskId(null);
      noteForm.reset();
      editor?.commands.setContent("");
    }
  };

  // const handleEditNote = (data: NoteFormData) => {
  //   if (editingNoteId) {
  //     const updatedNotes = notes.map((note) =>
  //       note.id === editingNoteId
  //         ? {
  //             ...note,
  //             text: data.text,
  //             updatedAt: new Date()
  //           }
  //         : note
  //     );
  //     setNotes(updatedNotes);
  //     setEditingNoteId(null);
  //     noteForm.reset();
  //     editor?.commands.setContent("");
  //   }
  // };

  // const handleDeleteNote = () => {
  //   if (isDeletingNoteId) {
  //     setNotes(notes.filter((note) => note.id !== isDeletingNoteId));
  //     setIsDeletingNoteId(null);
  //   }
  // };

  const formatDueDate = (dueDate: string) => {
    const date = parseISO(dueDate);
    const now = new Date();
    const distanceToNow = formatDistanceToNow(date, { addSuffix: true });

    if (distanceToNow === "in 1 day") return "Tomorrow";
    if (distanceToNow === "1 day ago") return "Yesterday";

    return distanceToNow;
  };

  const getDateColor = (dueDate: string) => {
    const date = parseISO(dueDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (isPast(date)) return "bg-red-500";
    if (diffInDays <= 2) return "bg-orange-500";
    if (diffInDays <= 7) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const openExternalLink = (url: string) => {
    window.open(url, "ExternalLink", "width=1280,height=720");
  };

  // const getLatestNote = (taskId: string) => {
  //   const taskNotes = notes.filter((note) => note.taskId === taskId);
  //   return taskNotes.sort(
  //     (a, b) =>
  //       new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  //   )[0];
  // };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            All tasks associated with this project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TaskSortNew />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Program Lead</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Date Modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasksList &&
                tasksList?.map((task) => (
                  <TasksListRow key={task.id} task={task} />
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isMarkCompletedOpen} onOpenChange={setIsMarkCompletedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Task as Completed</DialogTitle>
          </DialogHeader>
          <p>
            Do you want to mark the task "{selectedTask?.title}" as completed?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMarkCompletedOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMarkCompleted}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeletingNoteId !== null}
        onOpenChange={() => setIsDeletingNoteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Note</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeletingNoteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" /* onClick={handleDeleteNote} */>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TasksList;
