import { userRepository } from "../repositories/userRepository";
import type { ApiRequest, ApiResponse, User } from "../types";

type AuthResult = { ok: true; user: User } | { ok: false; response: ApiResponse };

/**
 * x-api-key ヘッダーで API キー認証を行う。
 * 成功するとリクエストに紐づくユーザーを返す。
 */
export function authenticate(req: ApiRequest): AuthResult {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return unauthorized("x-api-key ヘッダーが必要です");
  }

  const user = userRepository.findByApiKey(apiKey);
  if (!user) {
    return unauthorized("API キーが不正です");
  }

  if (user.revoked) {
    return unauthorized("この API キーは失効しています");
  }

  console.log(`[auth] ok user=${user.name} key=${apiKey}`);
  return { ok: true, user };
}

function unauthorized(message: string): AuthResult {
  return { ok: false, response: { status: 401, body: { error: message } } };
}
