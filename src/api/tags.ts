import { tagRepository } from "../repositories/tagRepository";
import type { ApiRequest, ApiResponse } from "../types";

export function listTagsHandler(): ApiResponse {
  return { status: 200, body: { items: tagRepository.all() } };
}

export function createTagHandler(req: ApiRequest): ApiResponse {
  const { name } = req.body as { name: string };
  const tag = tagRepository.insert({
    id: crypto.randomUUID(),
    name,
  });
  return { status: 201, body: tag };
}
