import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogFooter,
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
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  format,
  formatDistanceToNow,
  isFuture,
  isPast,
  parseISO,
} from "date-fns";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import NextLink from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// import { mockNotes } from "@/mocks";
// import { Note, Task, TaskStatus } from "@/types";
import { Note, Task, TaskStatus } from "@/types";
import TaskSortNew from "./TaskSortNew";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  pl: z.string().min(1, "Program lead is required"),
  jiraLink: z.string().url("Invalid Jira link"),
  dueDate: z.date(),
  status: z.enum(["Upcoming", "In Progress", "Done"]),
});

const noteSchema = z.object({
  content: z.string().min(1, "Note text is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;
type NoteFormData = z.infer<typeof noteSchema>;

const TasksListRow = ({ task }: { task: Task }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<
    string | null | undefined
  >(null);
  const [newNoteTaskId, setNewNoteTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMarkCompletedOpen, setIsMarkCompletedOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isDeletingNoteId, setIsDeletingNoteId] = useState<string | null>(null);

  const getDateColor = (dueDate: Date) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (isPast(date)) return "bg-red-500";
    if (diffInDays <= 2) return "bg-orange-500";
    if (diffInDays <= 7) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const formatDueDate = (dueDate: Date) => {
    const date = new Date(dueDate);
    const now = new Date();
    const distanceToNow = formatDistanceToNow(date, { addSuffix: true });

    if (distanceToNow === "in 1 day") return "Tomorrow";
    if (distanceToNow === "1 day ago") return "Yesterday";

    return distanceToNow;
  };

  const openExternalLink = (url: string) => {
    window.open(url, "ExternalLink", "width=1280,height=720");
  };

  const getLatestNote = (taskId: string) => {
    const taskNotes = task?.notes?.filter((note) => note.taskId === taskId);
    return taskNotes?.sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
    )[0];
  };

  const noteForm = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
  });

  const handleEditNote = (data: NoteFormData) => {
    if (editingNoteId) {
      const updatedNotes = task?.notes?.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              text: data.content,
              modifiedAt: new Date(),
            }
          : note
      );
      //   setNotes(updatedNotes);
      setEditingNoteId(null);
      noteForm.reset();
      editor?.commands.setContent("");
    }
  };

  const handleNewNote = (data: NoteFormData) => {
    if (newNoteTaskId) {
      const newNote: Note = {
        id: "51663d9e-2ac2-46ae-b336-f9325dd4eb6b",
        taskId: newNoteTaskId,
        content: data.content,
        createdAt: new Date(),
        modifiedAt: new Date(),
      };
      // setNotes([...notes, newNote]);
      setNewNoteTaskId(null);
      noteForm.reset();
      editor?.commands.setContent("");
    }
  };

  const handleMarkCompleted = () => {
    if (selectedTask) {
      const updatedTask: Task = {
        ...selectedTask,
        status: "done",
        modifiedAt: new Date(),
      };
      // setTasks(
      //   tasks.map((task) => (task.id === selectedTask.id ? updatedTask : task))
      // );
      setIsMarkCompletedOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">
          <div className="flex items-center space-x-2">
            <NextLink
              href={`/tasks?taskId=${task.id}`}
              className="font-bold hover:underline"
            >
              {task.title}
            </NextLink>
            <button
              onClick={() =>
                setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
              }
              className="focus:outline-none"
              title="View details"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedTaskId === task.id ? "transform rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </TableCell>
        <TableCell>{task.pl}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${getDateColor(task.dueDate)}`}
            ></div>
            <span title={format(task.dueDate, "dd.MM.yy")}>
              {formatDueDate(task.dueDate)}
            </span>
          </div>
        </TableCell>
        <TableCell>{format(task.createdAt || "", "dd.MM.yy")}</TableCell>
        <TableCell>{format(task.modifiedAt || "", "dd.MM.yy")}</TableCell>
        <TableCell>{task.status}</TableCell>
        <TableCell>
          <div className="flex space-x-2">
            <button
              onClick={() => openExternalLink(task.jiraLink || "")}
              className="text-gray-500 hover:text-gray-700"
              title="Open Jira Link"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setNewNoteTaskId(task ? (task.id ? task.id : null) : null)
              }
              className="text-gray-500 hover:text-gray-700"
              title="Add Note"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setSelectedTask(task);
                setIsMarkCompletedOpen(true);
              }}
              className="text-gray-500 hover:text-gray-700"
              title="Mark as Done"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7}>
          {getLatestNote(task.id || "") && (
            <div className="p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                {getLatestNote(task.id || "")?.content}
              </p>
            </div>
          )}
        </TableCell>
      </TableRow>
      {expandedTaskId === task.id && (
        <TableRow>
          <TableCell colSpan={7}>
            <div className="p-4 bg-gray-50">
              <p className="mb-2">
                <strong>Description:</strong> {task.description}
              </p>
              <h4 className="font-semibold mt-4 mb-2">Notes:</h4>
              {task.notes &&
                task?.notes
                  .filter((note) => note.taskId === task.id)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 p-2 bg-white rounded shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className="prose prose-sm"
                          dangerouslySetInnerHTML={{
                            __html: note.content,
                          }}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingNoteId(note.id);
                              noteForm.reset({ content: note.content });
                              editor?.commands.setContent(note.content);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsDeletingNoteId(note.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {format(
                          parseISO(note.createdAt.toISOString()),
                          "dd.MM.yy HH:mm"
                        )}
                      </p>
                    </div>
                  ))}
            </div>
          </TableCell>
        </TableRow>
      )}
      {(newNoteTaskId === task.id || editingNoteId) && (
        <TableRow>
          <TableCell colSpan={7}>
            <Form {...noteForm}>
              <form
                onSubmit={noteForm.handleSubmit(
                  editingNoteId ? handleEditNote : handleNewNote
                )}
                className="space-y-4 p-4 bg-gray-100"
              >
                <FormField
                  control={noteForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {editingNoteId ? "Edit Note" : "New Note"}
                      </FormLabel>
                      <FormControl>
                        <div className="border rounded-md p-2">
                          <div className="flex space-x-2 mb-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor?.chain().focus().toggleBold().run()
                              }
                              className={
                                editor?.isActive("bold") ? "bg-muted" : ""
                              }
                            >
                              <Bold className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor?.chain().focus().toggleItalic().run()
                              }
                              className={
                                editor?.isActive("italic") ? "bg-muted" : ""
                              }
                            >
                              <Italic className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                editor?.chain().focus().toggleBulletList().run()
                              }
                              className={
                                editor?.isActive("bulletList") ? "bg-muted" : ""
                              }
                            >
                              <List className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const url = window.prompt("Enter the URL");
                                if (url) {
                                  editor
                                    ?.chain()
                                    .focus()
                                    .setLink({ href: url })
                                    .run();
                                }
                              }}
                              className={
                                editor?.isActive("link") ? "bg-muted" : ""
                              }
                            >
                              <LinkIcon className="w-4 h-4" />
                            </Button>
                          </div>
                          <EditorContent
                            editor={editor}
                            className="prose prose-sm max-w-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewNoteTaskId(null);
                      setEditingNoteId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </TableCell>
        </TableRow>
      )}

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

export default TasksListRow;
