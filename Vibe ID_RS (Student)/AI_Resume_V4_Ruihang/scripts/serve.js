const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const preferredPort = Number(process.env.PORT || 5173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.createReadStream(filePath)
    .on("open", () => {
      res.writeHead(200, { "Content-Type": contentType });
    })
    .on("error", () => {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Unable to read file.");
    })
    .pipe(res);
}

const server = http.createServer((req, res) => {
  const host = req.headers.host || "localhost";
  const requestedPath = decodeURIComponent(new URL(req.url, `http://${host}`).pathname);
  const cleanPath = requestedPath === "/" ? "/index.html" : requestedPath;
  const baseRoot = cleanPath.startsWith("/User_data/") ? path.resolve(root, "..") : root;
  const filePath = path.resolve(baseRoot, `.${cleanPath}`);

  if (!isInside(filePath, baseRoot)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    sendFile(res, filePath);
  });
});

function isInside(filePath, basePath) {
  const relativePath = path.relative(basePath, filePath);
  return relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

function listen(port) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE") {
      listen(port + 1);
      return;
    }

    throw error;
  });

  server.listen(port, "127.0.0.1", () => {
    console.log(`Webpage ready at http://127.0.0.1:${port}/`);
  });
}

listen(preferredPort);
