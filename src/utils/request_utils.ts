import { IncomingMessage, ServerResponse } from "http";

export function sendJsonResponse(
  res: ServerResponse,
  statusCode: number,
  data: any | undefined,
): void {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  data ? res.end(JSON.stringify(data)) : res.end();
}

export function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}
