import ja from "../locales/ja.json";

// TODO: 現状は日本語のみ。en / zh / ko などへの展開と、
// API ハンドラのエラーメッセージを t() 経由に統一する作業は未対応(ISSUES.md #7)
type Messages = Record<string, string>;

const messages: Messages = ja as Messages;

export function t(key: string, params: Record<string, string> = {}): string {
  const template = messages[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_match, name: string) => params[name] ?? `{${name}}`);
}
