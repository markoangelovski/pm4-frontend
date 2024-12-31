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
