import { createTagHandler, listTagsHandler } from "./api/tags";
import { createProjectHandler, listProjectsHandler } from "./api/projects";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from "./api/tasks";
import { createUserHandler, meHandler } from "./api/users";
import type { ApiRequest, ApiResponse, Context } from "./types";

type Handler = (
  req: ApiRequest,
  ctx: Context,
  params: Record<string, string>,
) => ApiResponse | Promise<ApiResponse>;

interface Route {
  method: string;
  pattern: string;
  handler: Handler;
}

const routes: Route[] = [
  { method: "GET", pattern: "/tasks", handler: listTasksHandler },
  { method: "POST", pattern: "/tasks", handler: createTaskHandler },
  { method: "GET", pattern: "/tasks/:id", handler: getTaskHandler },
  { method: "PATCH", pattern: "/tasks/:id", handler: updateTaskHandler },
  { method: "DELETE", pattern: "/tasks/:id", handler: deleteTaskHandler },
  { method: "GET", pattern: "/users/me", handler: meHandler },
  { method: "POST", pattern: "/users", handler: createUserHandler },
  { method: "GET", pattern: "/projects", handler: listProjectsHandler },
  { method: "POST", pattern: "/projects", handler: createProjectHandler },
  { method: "GET", pattern: "/tags", handler: listTagsHandler },
  { method: "POST", pattern: "/tags", handler: createTagHandler },
];

export async function route(req: ApiRequest, ctx: Context): Promise<ApiResponse> {
  for (const candidate of routes) {
    if (candidate.method !== req.method) continue;
    const params = matchPath(candidate.pattern, req.path);
    if (!params) continue;
    return candidate.handler(req, ctx, params);
  }
  return { status: 404, body: { error: "リソースが見つかりません" } };
}

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = path.split("/").filter(Boolean);
  if (patternSegments.length !== pathSegments.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const expected = patternSegments[i];
    const actual = pathSegments[i];
    if (expected.startsWith(":")) {
      params[expected.slice(1)] = decodeURIComponent(actual);
    } else if (expected !== actual) {
      return null;
    }
  }
  return params;
}
