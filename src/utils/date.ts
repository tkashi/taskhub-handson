/**
 * 日時を "YYYY-MM-DD HH:mm" 形式の文字列にする。
 * タスクの期限表示などで使う。
 */
export function formatDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}
