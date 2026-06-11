import { taskRepository } from "../repositories/taskRepository";
import type { Task } from "../types";
import { formatDate } from "../utils/date";

export interface TaskDto {
  id: string;
  title: string;
  description: string;
  status: "open" | "done";
  dueDate: string | null;
  tags: string[];
  projectId: string | null;
  createdAt: string;
}

export interface ListOptions {
  page: number;
  perPage: number;
  q?: string;
}

export interface ListResult {
  total: number;
  page: number;
  perPage: number;
  items: TaskDto[];
}

export function listTasks(ownerId: string, opts: ListOptions): ListResult {
  let tasks = taskRepository.byOwner(ownerId);

  if (opts.q !== undefined && opts.q !== "") {
    const query = opts.q;
    tasks = tasks.filter((task) => task.title.includes(query));
  }

  const start = (opts.page - 1) * opts.perPage;
  const items = tasks.slice(start, start + opts.perPage - 1);

  return {
    total: tasks.length,
    page: opts.page,
    perPage: opts.perPage,
    items: items.map(toDto),
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string | null;
  tags?: string[];
  projectId?: string | null;
}

export function createTask(ownerId: string, input: CreateTaskInput): TaskDto {
  const task: Task = {
    id: crypto.randomUUID(),
    ownerId,
    title: input.title,
    description: input.description ?? "",
    status: "open",
    dueDate: input.dueDate ?? null,
    tags: input.tags ?? [],
    projectId: input.projectId ?? null,
    createdAt: new Date().toISOString(),
  };
  taskRepository.insert(task);
  return toDto(task);
}

export function toDto(task: Task): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate ? formatDate(new Date(task.dueDate)) : null,
    tags: task.tags,
    projectId: task.projectId,
    createdAt: task.createdAt,
  };
}
