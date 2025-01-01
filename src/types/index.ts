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
  id: string;
  title: string;
  description: string;
  pl: string;
  upcomingTasks: number;
  inProgressTasks: number;
  doneTasks: number;
  createdAt: string;
  modifiedAt: string;
};

enum TaskStatus {
  UPCOMING = "upcoming",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  pl: string;
  jiraLink?: string;
  dueDate?: Date;
  status: TaskStatus;
  createdAt: string;
  modifiedAt: string;
};
