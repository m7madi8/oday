/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const dirs = [path.join(root, ".next"), path.join(root, ".next-dev")];

function sleepSyncMs(ms) {
  try {
    if (process.platform === "win32") {
      execSync(`powershell -NoProfile -Command "Start-Sleep -Milliseconds ${ms}"`, {
        stdio: "ignore",
      });
    } else {
      execSync(`sleep ${Math.max(1, Math.ceil(ms / 1000))}`, { stdio: "ignore" });
    }
  } catch {
    /* ignore */
  }
}

for (let attempt = 0; attempt < 6; attempt++) {
  try {
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        process.stdout.write(`Removed ${dir}\n`);
      }
    }
    process.exit(0);
  } catch (e) {
    if (attempt === 5) {
      process.stderr.write(
        `Could not remove .next / .next-dev (stop npm run dev / other Node using this folder, then retry).\n${String(e)}\n`,
      );
      process.exit(1);
    }
    sleepSyncMs(500);
  }
}
