import { beforeEach, describe, expect, it } from "vitest";
import { resetStore } from "../src/repositories/store";
import { request } from "./helpers";

interface ListBody {
  total: number;
  items: Array<{ id: string; title: string; status: string }>;
}

beforeEach(() => {
  resetStore();
});

describe("タスク一覧", () => {
  it("自分のタスク一覧を取得できる", async () => {
    const res = await request("GET", "/tasks?perPage=50", { apiKey: "key-alice" });
    expect(res.status).toBe(200);
    const body = res.body as ListBody;
    expect(body.total).toBe(8);
    expect(body.items).toHaveLength(8);
  });

  it("他人のタスクは含まれない", async () => {
    const res = await request("GET", "/tasks?perPage=50", { apiKey: "key-bob" });
    const body = res.body as ListBody;
    expect(body.total).toBe(2);
  });

  it("タイトルで検索できる", async () => {
    const res = await request("GET", "/tasks?q=リリース", { apiKey: "key-alice" });
    const body = res.body as ListBody;
    expect(body.total).toBe(1);
    expect(body.items[0].title).toContain("リリース");
  });

  it("page に不正な値を渡すと 400 を返す", async () => {
    const res = await request("GET", "/tasks?page=abc", { apiKey: "key-alice" });
    expect(res.status).toBe(400);
  });
});

describe("タスク作成", () => {
  it("タスクを作成できる", async () => {
    const res = await request("POST", "/tasks", {
      apiKey: "key-alice",
      body: { title: "新しいタスク", dueDate: "2026-08-01T10:00:00+09:00" },
    });
    expect(res.status).toBe(201);
    const body = res.body as { title: string; status: string };
    expect(body.title).toBe("新しいタスク");
    expect(body.status).toBe("open");
  });

  it("title がないと 400 を返す", async () => {
    const res = await request("POST", "/tasks", {
      apiKey: "key-alice",
      body: { description: "タイトルなし" },
    });
    expect(res.status).toBe(400);
  });

  it("dueDate が不正な形式だと 400 を返す", async () => {
    const res = await request("POST", "/tasks", {
      apiKey: "key-alice",
      body: { title: "タスク", dueDate: "あした" },
    });
    expect(res.status).toBe(400);
  });
});

describe("タスク詳細・更新", () => {
  it("自分のタスク詳細を取得できる", async () => {
    const res = await request("GET", "/tasks/task-alice-1", { apiKey: "key-alice" });
    expect(res.status).toBe(200);
  });

  it("他人のタスク詳細は取得できない", async () => {
    const res = await request("GET", "/tasks/task-bob-1", { apiKey: "key-alice" });
    expect(res.status).toBe(404);
  });

  it("自分のタスクを完了にできる", async () => {
    const res = await request("PATCH", "/tasks/task-alice-1", {
      apiKey: "key-alice",
      body: { status: "done" },
    });
    expect(res.status).toBe(200);
    const body = res.body as { status: string };
    expect(body.status).toBe("done");
  });

  it("他人のタスクは更新できない", async () => {
    const res = await request("PATCH", "/tasks/task-bob-1", {
      apiKey: "key-alice",
      body: { status: "done" },
    });
    expect(res.status).toBe(404);
  });
});
