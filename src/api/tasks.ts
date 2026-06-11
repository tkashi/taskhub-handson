import { taskRepository } from "../repositories/taskRepository";
import { createTask, listTasks, toDto } from "../services/taskService";
import type { ApiRequest, ApiResponse, Context, Task } from "../types";

export function listTasksHandler(req: ApiRequest, ctx: Context): ApiResponse {
  const page = Number(req.query.get("page") ?? "1");
  const perPage = Number(req.query.get("perPage") ?? "20");
  const q = req.query.get("q") ?? undefined;

  if (!Number.isInteger(page) || page < 1) {
    return badRequest("page は 1 以上の整数で指定してください");
  }
  if (!Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
    return badRequest("perPage は 1〜100 の整数で指定してください");
  }

  return { status: 200, body: listTasks(ctx.user.id, { page, perPage, q }) };
}

export function createTaskHandler(req: ApiRequest, ctx: Context): ApiResponse {
  if (typeof req.body !== "object" || req.body === null) {
    return badRequest("JSON のリクエストボディが必要です");
  }
  const body = req.body as Record<string, unknown>;

  const title = body.title;
  if (typeof title !== "string" || title.trim() === "") {
    return badRequest("title は必須です");
  }
  if (title.length > 100) {
    return badRequest("title は 100 文字以内にしてください");
  }

  const description = body.description;
  if (description !== undefined && typeof description !== "string") {
    return badRequest("description は文字列で指定してください");
  }

  const dueDate = body.dueDate;
  if (
    dueDate !== undefined &&
    dueDate !== null &&
    (typeof dueDate !== "string" || Number.isNaN(Date.parse(dueDate)))
  ) {
    return badRequest("dueDate は ISO 8601 形式の日時で指定してください");
  }

  const tags = body.tags;
  if (
    tags !== undefined &&
    (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))
  ) {
    return badRequest("tags は文字列の配列で指定してください");
  }

  const projectId = body.projectId;
  if (projectId !== undefined && projectId !== null && typeof projectId !== "string") {
    return badRequest("projectId は文字列で指定してください");
  }

  const created = createTask(ctx.user.id, {
    title,
    description: description as string | undefined,
    dueDate: (dueDate as string | null | undefined) ?? null,
    tags: tags as string[] | undefined,
    projectId: (projectId as string | null | undefined) ?? null,
  });

  return { status: 201, body: created };
}

export function getTaskHandler(
  _req: ApiRequest,
  ctx: Context,
  params: Record<string, string>,
): ApiResponse {
  const task = taskRepository.find(params.id);
  if (!task || task.ownerId !== ctx.user.id) {
    return notFound();
  }
  return { status: 200, body: toDto(task) };
}

export function updateTaskHandler(
  req: ApiRequest,
  ctx: Context,
  params: Record<string, string>,
): ApiResponse {
  const task = taskRepository.find(params.id);
  if (!task || task.ownerId !== ctx.user.id) {
    return notFound();
  }

  if (typeof req.body !== "object" || req.body === null) {
    return badRequest("JSON のリクエストボディが必要です");
  }
  const body = req.body as Record<string, unknown>;
  const patch: Partial<Task> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim() === "") {
      return badRequest("title は空でない文字列で指定してください");
    }
    patch.title = body.title;
  }

  if (body.status !== undefined) {
    if (body.status !== "open" && body.status !== "done") {
      return badRequest('status は "open" か "done" で指定してください');
    }
    patch.status = body.status;
  }

  if (body.dueDate !== undefined) {
    if (
      body.dueDate !== null &&
      (typeof body.dueDate !== "string" || Number.isNaN(Date.parse(body.dueDate)))
    ) {
      return badRequest("dueDate は ISO 8601 形式の日時で指定してください");
    }
    patch.dueDate = body.dueDate as string | null;
  }

  const updated = taskRepository.update(task.id, patch);
  if (!updated) {
    return notFound();
  }
  return { status: 200, body: toDto(updated) };
}

export function deleteTaskHandler(
  _req: ApiRequest,
  _ctx: Context,
  params: Record<string, string>,
): ApiResponse {
  const task = taskRepository.find(params.id);
  if (!task) {
    return notFound();
  }
  taskRepository.remove(task.id);
  return { status: 204 };
}

function badRequest(message: string): ApiResponse {
  return { status: 400, body: { error: message } };
}

function notFound(): ApiResponse {
  return { status: 404, body: { error: "タスクが見つかりません" } };
}
