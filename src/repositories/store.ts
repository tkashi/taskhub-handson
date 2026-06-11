import type { Project, Tag, Task, User } from "../types";

export const db = {
  users: [] as User[],
  tasks: [] as Task[],
  projects: [] as Project[],
  tags: [] as Tag[],
};

/** テストやデモのために、ストアを初期データへ戻す */
export function resetStore(): void {
  db.users = [
    { id: "user-alice", name: "Alice", apiKey: "key-alice", revoked: false },
    { id: "user-bob", name: "Bob", apiKey: "key-bob", revoked: false },
    { id: "user-charlie", name: "Charlie", apiKey: "key-charlie", revoked: true },
  ];

  db.projects = [
    { id: "project-internal", name: "社内ツール刷新" },
    { id: "project-api-v2", name: "API v2" },
  ];

  db.tags = [
    { id: "tag-urgent", name: "urgent" },
    { id: "tag-backlog", name: "backlog" },
  ];

  db.tasks = [
    {
      id: "task-alice-1",
      ownerId: "user-alice",
      title: "リリースノートの作成",
      description: "v1.4 の変更点をまとめる",
      status: "open",
      dueDate: "2026-07-01T09:00:00+09:00",
      tags: ["urgent"],
      projectId: "project-api-v2",
      createdAt: "2026-06-01T10:00:00Z",
    },
    {
      id: "task-alice-2",
      ownerId: "user-alice",
      title: "Claude Code 勉強会の資料レビュー",
      description: "ハンズオン手順の確認",
      status: "open",
      dueDate: "2026-06-20T18:00:00+09:00",
      tags: [],
      projectId: "project-internal",
      createdAt: "2026-06-02T10:00:00Z",
    },
    {
      id: "task-alice-3",
      ownerId: "user-alice",
      title: "API ドキュメントの更新",
      description: "新しいエンドポイントを追記",
      status: "open",
      dueDate: null,
      tags: ["backlog"],
      projectId: "project-api-v2",
      createdAt: "2026-06-03T10:00:00Z",
    },
    {
      id: "task-alice-4",
      ownerId: "user-alice",
      title: "ステージング環境の動作確認",
      description: "リリース前の最終チェック",
      status: "open",
      dueDate: "2026-06-25T12:00:00+09:00",
      tags: ["urgent"],
      projectId: null,
      createdAt: "2026-06-04T10:00:00Z",
    },
    {
      id: "task-alice-5",
      ownerId: "user-alice",
      title: "依存パッケージのアップデート",
      description: "セキュリティアップデートの適用",
      status: "done",
      dueDate: null,
      tags: ["backlog"],
      projectId: "project-internal",
      createdAt: "2026-06-05T10:00:00Z",
    },
    {
      id: "task-alice-6",
      ownerId: "user-alice",
      title: "ログ出力の整理",
      description: "不要な debug ログを削除",
      status: "open",
      dueDate: null,
      tags: [],
      projectId: "project-internal",
      createdAt: "2026-06-06T10:00:00Z",
    },
    {
      id: "task-alice-7",
      ownerId: "user-alice",
      title: "週次レポートの送付",
      description: "金曜までにマネージャーへ送る",
      status: "open",
      dueDate: "2026-06-19T17:00:00+09:00",
      tags: [],
      projectId: null,
      createdAt: "2026-06-07T10:00:00Z",
    },
    {
      id: "task-alice-8",
      ownerId: "user-alice",
      title: "バックアップスクリプトの修正",
      description: "リトライ処理を追加する",
      status: "open",
      dueDate: null,
      tags: ["backlog"],
      projectId: null,
      createdAt: "2026-06-08T10:00:00Z",
    },
    {
      id: "task-bob-1",
      ownerId: "user-bob",
      title: "オンボーディング資料の更新",
      description: "新メンバー向け",
      status: "open",
      dueDate: null,
      tags: [],
      projectId: null,
      createdAt: "2026-06-01T11:00:00Z",
    },
    {
      id: "task-bob-2",
      ownerId: "user-bob",
      title: "障害対応手順の見直し",
      description: "エスカレーションフローの整理",
      status: "open",
      dueDate: "2026-06-30T10:00:00+09:00",
      tags: ["urgent"],
      projectId: null,
      createdAt: "2026-06-02T11:00:00Z",
    },
  ];
}

resetStore();
