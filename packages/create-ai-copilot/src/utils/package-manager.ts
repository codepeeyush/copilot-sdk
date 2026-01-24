import { execSync, spawn } from "child_process";
import path from "path";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export function detectPackageManager(): PackageManager {
  // Check for user agent (set by package managers when running scripts)
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("bun")) return "bun";
    if (userAgent.startsWith("npm")) return "npm";
  }

  // Fallback: check which package managers are installed
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
    // pnpm not available
  }

  try {
    execSync("yarn --version", { stdio: "ignore" });
    return "yarn";
  } catch {
    // yarn not available
  }

  try {
    execSync("bun --version", { stdio: "ignore" });
    return "bun";
  } catch {
    // bun not available
  }

  return "npm";
}

export function runInstall(
  projectName: string,
  pm: PackageManager,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cwd = path.join(process.cwd(), projectName);

    // Use --ignore-workspace for pnpm to avoid workspace hoisting issues
    const args =
      pm === "pnpm" ? ["install", "--ignore-workspace"] : ["install"];

    const child = spawn(pm, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${pm} install exited with code ${code}`));
      }
    });

    child.on("error", reject);
  });
}
