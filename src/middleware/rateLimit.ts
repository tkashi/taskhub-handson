import type { ApiRequest } from "../types";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 100;

const hits = new Map<string, number[]>();

/**
 * 同一クライアントからの過剰なリクエストを弾く簡易レートリミッター。
 * クライアントの識別には API キーを使い、なければ匿名として扱う。
 */
export function checkRateLimit(req: ApiRequest): { ok: boolean } {
  const clientKey = req.headers["x-api-key"] ?? "anonymous";
  const now = Date.now();

  const recent = (hits.get(clientKey) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(clientKey, recent);

  return { ok: recent.length <= MAX_REQUESTS_PER_WINDOW };
}
