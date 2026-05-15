/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Windows: stops Node listeners on ports 3000–3010, then runs `next dev` (webpack).
 * Dev output goes to `.next-dev` (see next.config.mjs + NEXT_DEV_DIST) so it does not
 * fight with `next build` / `.next` — fewer stale chunk errors on Windows.
 * (Turbopack + custom distDir caused ENOENT manifest errors on some setups.)
 * Use `--clear-next` after errors like "Cannot find module './NNN.js'":
 *   npm run dev:clean
 * Other OS: starts dev only (no port kill). Pass `--clear-next` to wipe `.next` + `.next-dev`.
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
const nextDevDir = path.join(root, ".next-dev");

if (clearNext) {
  const fs = require("fs");
  if (process.platform === "win32") {
    sleepSyncMs(600);
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      for (const dir of [nextDir, nextDevDir]) {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          process.stdout.write(`Removed ${dir}\n`);
        }
      }
      break;
    } catch (e) {
      if (attempt === 5) {
        process.stderr.write(
          `Could not remove .next / .next-dev (file may be locked). Close terminals using this project, then run: npm run clean\n${String(e)}\n`,
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
  env: { ...process.env, NEXT_DEV_DIST: "1" },
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
