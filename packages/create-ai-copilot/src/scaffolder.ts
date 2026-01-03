import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import type { UserChoices, Provider } from "./prompts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface ProviderConfig {
  envKey: string;
  defaultModel: string;
  importName: string;
}

const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = {
  openai: {
    envKey: "OPENAI_API_KEY",
    defaultModel: "gpt-4o-mini",
    importName: "openai",
  },
  anthropic: {
    envKey: "ANTHROPIC_API_KEY",
    defaultModel: "claude-3-5-sonnet-20241022",
    importName: "anthropic",
  },
  google: {
    envKey: "GOOGLE_API_KEY",
    defaultModel: "gemini-2.0-flash",
    importName: "google",
  },
  xai: {
    envKey: "XAI_API_KEY",
    defaultModel: "grok-3-fast-beta",
    importName: "xai",
  },
};

export async function scaffoldProject(choices: UserChoices): Promise<void> {
  const targetDir = path.join(process.cwd(), choices.projectName);
  const templateDir = path.join(
    __dirname,
    "..",
    "templates",
    choices.framework,
  );

  // Check if template exists
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template not found: ${choices.framework}`);
  }

  // Copy template
  await fs.copy(templateDir, targetDir, {
    overwrite: false,
    errorOnExist: true,
  });

  // Get provider config
  const providerConfig = PROVIDER_CONFIGS[choices.provider];

  // Process template files
  await processTemplateFiles(targetDir, choices, providerConfig);

  // Update package.json
  await updatePackageJson(targetDir, choices.projectName);

  // Create .env file
  await createEnvFile(targetDir, choices, providerConfig);

  // Rename gitignore
  const gitignorePath = path.join(targetDir, "_gitignore");
  if (fs.existsSync(gitignorePath)) {
    await fs.rename(gitignorePath, path.join(targetDir, ".gitignore"));
  }
}

async function processTemplateFiles(
  dir: string,
  choices: UserChoices,
  config: ProviderConfig,
): Promise<void> {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      await processTemplateFiles(filePath, choices, config);
    } else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) {
      let content = await fs.readFile(filePath, "utf-8");

      // Replace placeholders
      content = content
        .replace(/\{\{provider\}\}/g, config.importName)
        .replace(/\{\{model\}\}/g, config.defaultModel)
        .replace(/\{\{envKey\}\}/g, config.envKey)
        .replace(/\{\{projectName\}\}/g, choices.projectName);

      await fs.writeFile(filePath, content, "utf-8");
    }
  }
}

async function updatePackageJson(
  dir: string,
  projectName: string,
): Promise<void> {
  const packageJsonPath = path.join(dir, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const pkg = await fs.readJson(packageJsonPath);
    pkg.name = projectName;
    await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
  }
}

async function createEnvFile(
  dir: string,
  choices: UserChoices,
  config: ProviderConfig,
): Promise<void> {
  const envContent = choices.apiKey
    ? `${config.envKey}=${choices.apiKey}\n`
    : `${config.envKey}=your_api_key_here\n`;

  await fs.writeFile(path.join(dir, ".env"), envContent, "utf-8");

  // Also create .env.example
  const envExampleContent = `# ${choices.provider.toUpperCase()} API Key
${config.envKey}=your_api_key_here
`;

  await fs.writeFile(
    path.join(dir, ".env.example"),
    envExampleContent,
    "utf-8",
  );
}
