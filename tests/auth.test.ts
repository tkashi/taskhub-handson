import { beforeEach, describe, expect, it } from "vitest";
import { resetStore } from "../src/repositories/store";
import { request } from "./helpers";

beforeEach(() => {
  resetStore();
});

describe("認証", () => {
  it("API キーがないと 401 を返す", async () => {
    const res = await request("GET", "/tasks");
    expect(res.status).toBe(401);
  });

  it("不正な API キーは 401 を返す", async () => {
    const res = await request("GET", "/tasks", { apiKey: "key-unknown" });
    expect(res.status).toBe(401);
  });

  it("失効した API キーは 401 を返す", async () => {
    const res = await request("GET", "/tasks", { apiKey: "key-charlie" });
    expect(res.status).toBe(401);
  });

  it("正しい API キーで自分の情報を取得できる", async () => {
    const res = await request("GET", "/users/me", { apiKey: "key-alice" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "user-alice", name: "Alice" });
  });

  it("/health は認証不要", async () => {
    const res = await request("GET", "/health");
    expect(res.status).toBe(200);
  });
});
