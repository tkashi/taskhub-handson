export interface User {
  id: string;
  name: string;
  apiKey: string;
  revoked: boolean;
}

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  status: "open" | "done";
  dueDate: string | null;
  tags: string[];
  projectId: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ApiRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: Record<string, string>;
  body?: unknown;
}

export interface ApiResponse {
  status: number;
  body?: unknown;
}

export interface Context {
  user: User;
}
