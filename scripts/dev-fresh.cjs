/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Windows: stops Node listeners on ports 3000–3010, then runs `next dev`.
 * Use `--clear-next` after errors like "Cannot find module './NNN.js'" (stale `.next`):
 *   npm run dev:clean
 * Other OS: starts `next dev` only (no port kill). Pass `--clear-next` to wipe `.next` first.
 */
const { execSync, spawn } = require("child_process");
const path = require("path");

const clearNext = process.argv.includes("--clear-next");

const ports = Array.from({ length: 11 }, (_, i) => 3000 + i);

function collectListeningPidsWin32() {
  const pids = new Set();
  if (process.platform !== "win32") return pids;
  let out;
  try {
    out = execSync("netstat -ano", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return pids;
  }
  for (const line of out.split(/\r?\n/)) {
    const upper = line.toUpperCase();
    if (!upper.includes("LISTENING")) continue;
    for (const port of ports) {
      const re = new RegExp(`:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)\\s*$`, "i");
      const m = line.match(re);
      if (m) pids.add(m[1]);
    }
  }
  return pids;
}

for (const pid of collectListeningPidsWin32()) {
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    process.stdout.write(`Stopped process ${pid} (freed a dev port).\n`);
  } catch {
    /* ignore */
  }
}

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

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");

if (clearNext) {
  const fs = require("fs");
  if (process.platform === "win32") {
    sleepSyncMs(600);
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      if (fs.existsSync(nextDir)) {
        fs.rmSync(nextDir, { recursive: true, force: true });
        process.stdout.write(`Removed ${nextDir}\n`);
      }
      break;
    } catch (e) {
      if (attempt === 5) {
        process.stderr.write(
          `Could not remove .next (file may be locked). Close terminals using this project, then run: npm run clean\n${String(e)}\n`,
        );
        process.exit(1);
      }
      sleepSyncMs(500);
    }
  }
}
/** Run `next` via Node (avoids Windows `spawn EINVAL` on `.cmd` with `shell: false`). */
const nextCli = path.join(root, "node_modules", "next", "dist", "bin", "next");

const child = spawn(process.execPath, [nextCli, "dev"], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
