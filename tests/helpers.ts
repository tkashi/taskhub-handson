import { handleRequest } from "../src/server";
import type { ApiResponse } from "../src/types";

interface RequestOptions {
  apiKey?: string;
  body?: unknown;
}

/** handleRequest を HTTP サーバーなしで直接呼ぶテスト用ヘルパー */
export function request(
  method: string,
  path: string,
  opts: RequestOptions = {},
): Promise<ApiResponse> {
  const url = new URL(path, "http://localhost");
  const headers: Record<string, string> = {};
  if (opts.apiKey) headers["x-api-key"] = opts.apiKey;

  return handleRequest({
    method,
    path: url.pathname,
    query: url.searchParams,
    headers,
    body: opts.body,
  });
}
