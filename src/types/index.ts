export interface ApiResponse<T> {
  hasErrors: boolean;
  statusCode: number;
  message: string;
  data: T[];
}

// Mock types - to be updated

export type TaskStatus = "upcoming" | "in-progress" | "done";

export type UUID = string;

export type User = {
  id?: UUID;
  email?: string;
  username: string;
  password: string;
  createdAt?: Date;
  modifiedAt?: Date;
  emailMd5?: string;
  projects?: Project[];
};

export type Project = {
  id?: UUID;
  title: string;
  description?: string;
  pl: string;
  upcomingTasks?: number;
  inProgressTasks?: number;
  doneTasks?: number;
  createdAt?: Date;
  modifiedAt?: Date;
  tasks?: Task[];
};

export type Task = {
  id?: UUID;
  projectId?: UUID;
  title: string;
  description?: string;
  pl?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  status: TaskStatus;
  jiraLink?: string;
  dueDate: Date;
  notes?: Note[];
};

export type Note = {
  id: UUID;
  taskId: UUID;
  content: string;
  createdAt: Date;
  modifiedAt: Date;
};

export type Day = {
  id: UUID;
  createdAt: Date;
  modifiedAt: Date;
  startOfWork: number;
  workedHours: number;
  bookedHours: number;
  externalBooking: number;
  overtime: number;
  workingDate: Date;
  events: PmEvent[];
};

export type PmEvent = {
  id: UUID;
  createdAt: Date;
  modifiedAt?: Date;
  title: string;
  workedHours?: number;
  bookedHours?: number;
  externalBooking?: number;
  taskId?: UUID;
  taskTitle?: string;
  logs: Log[];
  bookings?: Booking[];
  duration: number;
  totalBooked: number;
};

export type Log = {
  id: UUID;
  createdAt: Date;
  modifiedAt: Date;
  eventId: UUID;
  description: string;
  duration: number;
};

export type Booking = {
  createdAt: Date;
  modifiedAt: Date;
  amount: number;
  bookedDate: Date;
};
