import { userRepository } from "../repositories/userRepository";
import type { ApiRequest, ApiResponse, Context } from "../types";

export function meHandler(_req: ApiRequest, ctx: Context): ApiResponse {
  return { status: 200, body: { id: ctx.user.id, name: ctx.user.name } };
}

export function createUserHandler(req: ApiRequest): ApiResponse {
  const { name } = req.body as { name: string };
  const user = userRepository.insert({
    id: crypto.randomUUID(),
    name,
    apiKey: `key-${crypto.randomUUID()}`,
    revoked: false,
  });
  return { status: 201, body: user };
}
