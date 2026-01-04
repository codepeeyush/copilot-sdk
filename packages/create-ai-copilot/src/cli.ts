import * as p from "@clack/prompts";
import pc from "picocolors";
import { getPrompts, type UserChoices } from "./prompts.js";
import { scaffoldProject } from "./scaffolder.js";
import { detectPackageManager, runInstall } from "./utils/package-manager.js";

export async function main() {
  console.clear();

  p.intro(pc.bgCyan(pc.black(" Create AI Copilot ")));

  // Handle Ctrl+C gracefully
  process.on("SIGINT", () => {
    p.cancel("Operation cancelled.");
    process.exit(0);
  });

  // Get user choices
  const choices = await getPrompts();

  if (!choices) {
    p.cancel("Setup cancelled.");
    process.exit(0);
  }

  // Scaffold the project
  const spinner = p.spinner();
  spinner.start("Creating your project...");

  try {
    await scaffoldProject(choices);
    spinner.stop("Project created!");

    // Ask about installing dependencies
    const shouldInstall = await p.confirm({
      message: "Install dependencies?",
      initialValue: true,
    });

    if (p.isCancel(shouldInstall)) {
      p.cancel("Setup cancelled.");
      process.exit(0);
    }

    if (shouldInstall) {
      const pm = detectPackageManager();
      const installSpinner = p.spinner();
      installSpinner.start(`Installing dependencies with ${pm}...`);

      try {
        await runInstall(choices.projectName, pm);
        installSpinner.stop("Dependencies installed!");
      } catch {
        installSpinner.stop("Failed to install dependencies.");
        p.log.warn(
          `Run ${pc.cyan(`cd ${choices.projectName} && ${pm} install`)} manually.`,
        );
      }
    }

    // Show next steps
    const nextSteps = getNextSteps(choices);
    p.note(nextSteps, "Next steps");

    p.outro(pc.green("Happy coding! ") + pc.dim("https://docs.yourgpt.ai"));
  } catch (error) {
    spinner.stop("Failed to create project.");
    p.cancel(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    process.exit(1);
  }
}

function getNextSteps(choices: UserChoices): string {
  const pm = detectPackageManager();
  const steps = [`cd ${choices.projectName}`];

  if (!choices.apiKey) {
    steps.push(`# Add your API key to .env`);
  }

  steps.push(`${pm} run dev`);

  return steps.join("\n");
}
