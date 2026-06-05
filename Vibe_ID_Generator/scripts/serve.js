#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const portArgIndex = process.argv.findIndex((arg) => arg === "--port" || arg === "-p");
const portArg = portArgIndex !== -1 ? process.argv[portArgIndex + 1] : process.argv[2];
const PORT = Number(process.env.PORT || portArg || 8095);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".pdf": "application/pdf"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/api/generate-vibe") {
    handleGenerateApi(req, res);
    return;
  }

  if (pathname === "/") pathname = "/Vibe_ID_Generator/";
  if (pathname.endsWith("/")) pathname += "index.html";

  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.setHeader("Content-Type", TYPES[path.extname(file).toLowerCase()] || "application/octet-stream");
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Vibe ID Generator: http://localhost:${PORT}/Vibe_ID_Generator/`);
});

function handleGenerateApi(req, res) {
  const chunks = [];
  let size = 0;
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > 20 * 1024 * 1024) {
      res.writeHead(413, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Request body too large" }));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on("end", async () => {
    let body = {};
    try {
      const raw = Buffer.concat(chunks).toString("utf8");
      body = raw ? JSON.parse(raw) : {};
    } catch (error) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON body" }));
      return;
    }

    const handlerPath = path.join(ROOT, "api", "generate-vibe.js");
    delete require.cache[require.resolve(handlerPath)];
    const handler = require(handlerPath);
    const localReq = { method: req.method, body };
    const localRes = {
      statusCode: 200,
      headers: {},
      setHeader(key, value) {
        this.headers[key] = value;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        res.writeHead(this.statusCode, Object.assign({ "Content-Type": "application/json" }, this.headers));
        res.end(JSON.stringify(payload));
      },
      end(value) {
        res.writeHead(this.statusCode, this.headers);
        res.end(value);
      }
    };
    await handler(localReq, localRes);
  });
}
