/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const nextDir = path.join(__dirname, "..", ".next");
try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  process.stdout.write(`Removed ${nextDir}\n`);
} catch (e) {
  process.stderr.write(String(e) + "\n");
  process.exit(1);
}
