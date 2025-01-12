export type Response<T, E = unknown> = {
  limit: number;
  offset: number;
  totalResults: number;
  results: T[];
  hasErrors: boolean;
  errors: E[];
};

export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

export type Project = {
  title: string;
  description: string;
  pl: string;
  upcomingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
};

export interface ProjectFromServer extends Project {
  id: string;
  createdAt: string;
  modifiedAt: string;
}

export enum TaskStatus {
  UPCOMING = "upcoming",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export interface Task {
  projectId: string;
  title: string;
  description: string;
  pl: string;
  jiraLink?: string;
  dueDate: string;
  status: TaskStatus;
}

export interface TaskFromServer extends Task {
  id: string;
  createdAt: string;
  modifiedAt: string;
}

export interface TaskFromServerWithProject extends TaskFromServer {
  project: Project;
}

export interface Log {
  id: string;
  title: string;
  duration: number;
  createdAt: string;
  modifiedAt: string;
}

export interface PmEvent {
  id: string;
  title: string;
  day: string;
  createdAt: string;
  modifiedAt: string;
  logs: Log[];
  task: TaskFromServer | null;
}

export interface Day {
  id: string;
  start: number;
  day?: string;
}
