import { createServer } from "node:http";
import { handleRequest } from "./server";
import type { ApiRequest } from "./types";
import { t } from "./utils/i18n";

const PORT = Number(process.env.PORT ?? 3000);

const server = createServer((req, res) => {
  const chunks: Buffer[] = [];
  req.on("data", (chunk: Buffer) => chunks.push(chunk));
  req.on("end", () => {
    void (async () => {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") headers[key.toLowerCase()] = value;
      }

      let body: unknown;
      const raw = Buffer.concat(chunks).toString("utf8");
      if (raw !== "") {
        try {
          body = JSON.parse(raw);
        } catch {
          res.writeHead(400, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "リクエストボディの JSON が不正です" }));
          return;
        }
      }

      const apiReq: ApiRequest = {
        method: req.method ?? "GET",
        path: url.pathname,
        query: url.searchParams,
        headers,
        body,
      };

      const result = await handleRequest(apiReq);
      res.writeHead(result.status, { "content-type": "application/json; charset=utf-8" });
      res.end(result.body === undefined ? "" : JSON.stringify(result.body));
    })();
  });
});

server.listen(PORT, () => {
  console.log(t("server.started", { port: String(PORT) }));
});
