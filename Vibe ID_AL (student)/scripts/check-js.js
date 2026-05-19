const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const roots = [
  path.join(process.cwd(), "AI_Resume_V4_Arron", "assets")
];

function collectJsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath, out);
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      out.push(fullPath);
    }
  }

  return out;
}

const files = roots.flatMap((root) => collectJsFiles(root));

if (files.length === 0) {
  console.error("No JavaScript files found.");
  process.exit(1);
}

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log(`Checked ${files.length} JavaScript files.`);
