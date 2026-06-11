import { projectRepository } from "../repositories/projectRepository";
import type { ApiRequest, ApiResponse } from "../types";

export function listProjectsHandler(): ApiResponse {
  return { status: 200, body: { items: projectRepository.all() } };
}

export function createProjectHandler(req: ApiRequest): ApiResponse {
  const { name } = req.body as { name: string };
  const project = projectRepository.insert({
    id: crypto.randomUUID(),
    name,
  });
  return { status: 201, body: project };
}
