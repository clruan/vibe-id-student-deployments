const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5173);
const defaultPage = "AI_Resume_V4_Arron";
const rootArg = process.argv[2] || ".";
const root = path.resolve(process.cwd(), rootArg);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${host}:${port}`);
  const decodedPath = decodeURIComponent(url.pathname);

  if (decodedPath === "/" && rootArg === ".") {
    res.writeHead(302, { Location: `/${defaultPage}/` });
    res.end();
    return;
  }

  let filePath = path.resolve(root, `.${decodedPath}`);

  if (!isInside(filePath, root)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }

    const contentType = types[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    send(res, 200, data, {
      "Content-Type": contentType,
      "Cache-Control": "no-store"
    });
  });
});

server.listen(port, host, () => {
  console.log(`Vibe ID dev server running at http://${host}:${port}/`);
  console.log(`Serving ${root}`);
});
