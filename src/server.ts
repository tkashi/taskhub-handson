import { authenticate } from "./middleware/auth";
import { checkRateLimit } from "./middleware/rateLimit";
import { route } from "./router";
import type { ApiRequest, ApiResponse } from "./types";

/**
 * 1 リクエストの処理パイプライン:
 *   ヘルスチェック → レートリミット → 認証 → ルーティング → 各ハンドラ
 */
export async function handleRequest(req: ApiRequest): Promise<ApiResponse> {
  if (req.method === "GET" && req.path === "/health") {
    return { status: 200, body: { ok: true } };
  }

  if (!checkRateLimit(req).ok) {
    return {
      status: 429,
      body: { error: "リクエストが多すぎます。しばらく待って再試行してください" },
    };
  }

  const auth = authenticate(req);
  if (!auth.ok) {
    return auth.response;
  }

  return route(req, { user: auth.user });
}
