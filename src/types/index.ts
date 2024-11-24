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
  updatedAt?: Date;
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
  id: UUID;
  projectId: UUID;
  title: string;
  description?: string;
  pl: string;
  createdAt: Date;
  updatedAt: Date;
  status: TaskStatus;
  jiraLink: string;
  dueDate: Date;
  notes?: Note[];
};

export type Note = {
  id: UUID;
  taskId: UUID;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Day = {
  createdAt: Date;
  updatedAt: Date;
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
  updatedAt: Date;
  title: string;
  workedHours: number;
  bookedHours: number;
  externalBooking: number;
  taskId: UUID;
  logs: Log[];
  bookings: Booking[];
};

export type Log = {
  createdAt: Date;
  updatedAt: Date;
  eventId: UUID;
  description: string;
  duration: number;
};

export type Booking = {
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  bookedDate: Date;
};
