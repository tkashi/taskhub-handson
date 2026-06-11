# TaskHub

Claude Code ワークショップの練習用リポジトリです。
小さなタスク管理 API(TypeScript / 外部ランタイム依存なし)で、
**意図的なバグや未整備な箇所が含まれています**(バグ票は [ISSUES.md](./ISSUES.md))。

## セットアップ

Node.js 20 以上と pnpm が必要です(pnpm 未導入なら `corepack enable pnpm`)。

```bash
pnpm install
pnpm test        # テスト実行(初期状態で全部通ります)
pnpm lint        # ESLint
pnpm typecheck
pnpm dev         # http://localhost:3000 で API を起動
```

## API の使い方

認証は `x-api-key` ヘッダーで行います。シードユーザーのキー:

| ユーザー | API キー | 備考 |
|---|---|---|
| Alice | `key-alice` | タスク 8 件 |
| Bob | `key-bob` | タスク 2 件 |
| Charlie | `key-charlie` | 失効済み(401 になる) |

```bash
# タスク一覧
curl -H "x-api-key: key-alice" "http://localhost:3000/tasks?page=1&perPage=5"

# 検索
curl -H "x-api-key: key-alice" "http://localhost:3000/tasks?q=リリース"

# タスク作成
curl -X POST -H "x-api-key: key-alice" -H "content-type: application/json" \
  -d '{"title":"新しいタスク","dueDate":"2026-08-01T10:00:00+09:00"}' \
  http://localhost:3000/tasks
```

### エンドポイント一覧

| メソッド | パス | 説明 |
|---|---|---|
| GET | `/health` | ヘルスチェック(認証不要) |
| GET | `/tasks` | 自分のタスク一覧(`page` / `perPage` / `q`) |
| POST | `/tasks` | タスク作成 |
| GET | `/tasks/:id` | タスク詳細 |
| PATCH | `/tasks/:id` | タスク更新(`title` / `status` / `dueDate`) |
| DELETE | `/tasks/:id` | タスク削除 |
| GET | `/users/me` | 自分の情報 |
| POST | `/users` | ユーザー登録 |
| GET / POST | `/projects` | プロジェクト一覧 / 作成 |
| GET / POST | `/tags` | タグ一覧 / 作成 |

## アーキテクチャ

1 リクエストは次の順で処理されます:

```
HTTP (src/main.ts)
  → handleRequest (src/server.ts)
      → レートリミット (src/middleware/rateLimit.ts)
      → API キー認証   (src/middleware/auth.ts)
      → ルーティング   (src/router.ts)
          → ハンドラ   (src/api/*.ts)
              → サービス     (src/services/*.ts)
                  → リポジトリ (src/repositories/*.ts, インメモリ)
```

## ワークショップでの使い方

| 演習 | このリポジトリでやること |
|---|---|
| 演習 1: CLAUDE.md / Rules | **CLAUDE.md は意図的に置いていません。** `/init` で生成し、テストコマンドと規約(例:「ストアを直接触らずリポジトリ経由」)を追記する |
| 演習 2: Plan Mode 調査 | 「`GET /tasks` のリクエストが入ってからレスポンスを返すまでに通るファイルと関数を順番に調査して」を Plan Mode で依頼する |
| 演習 3: 完了条件つき修正 | [ISSUES.md](./ISSUES.md) の #1〜#3 から 1 つ選び、「再現テスト追加 + `pnpm test` / `pnpm lint` が通る」を完了条件に修正を任せる |
| 次回(並列・マルチエージェント編) | ISSUES.md の #4 以降を使う |

> 注意: このリポジトリのコードは教材です。バグの場所をコード中のコメントで
> 示すことはしていません(探すのも演習のうちです)。
