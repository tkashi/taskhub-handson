---
paths:
  - "tests/**/*.ts"
---

# テストの書き方

- describe / it の説明は日本語で書く(既存テストに合わせる)
- 実 HTTP サーバーやネットワークに依存させない。
  `tests/helpers.ts` の `request()` 経由で `handleRequest` を直接呼ぶ
- データに依存するテストは `beforeEach` で `resetStore()` を呼んでから書く
