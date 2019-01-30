import { build } from "@manta-style/builder-typescript";
import fs from "fs";
import path from "path";
import process from "process";
import program from "commander";
import packageJson from "../package.json";
import spawn from "cross-spawn";
import chalk from "chalk";
import { findRoot } from "./findRoot";
import { generateSuperGuideBasedOnFile } from "./superGuide";

program
  .version(packageJson.version)
  .option("-i --inputFile <file>", "The entrypoint of files to be compiled")
  .option("-o --outputDir <dir>", "The output directory of compiled files")
  .option(
    "-c --cjs",
    "Transpile modules to CommonJS (Otherwise it will output ES modules)"
  )
  .parse(process.argv);

const mantaStyleVersion = packageJson.dependencies[
  "@manta-style/builder-typescript"
].replace(/[^\~]/, "");

const { inputFile, outputDir, cjs: transpileModule } = program;

console.log(chalk`🎩  {yellow.bold Magic Type} ${packageJson.version}`);
console.log(chalk`🚀  {dim Manta Style Runtime: ${mantaStyleVersion}}\n`);

function detectPackageManager(): "yarn" | "npm" {
  const projectRoot = findRoot(process.cwd());
  return fs.existsSync(path.join(projectRoot, "yarn.lock")) ? "yarn" : "npm";
}

function fatalError(message: string): never {
  console.log(chalk.red(`Error: ${message}\n`));
  return process.exit(1);
}

function packageManagerInstall(...bundleNames: string[]) {
  const packageManager = detectPackageManager();
  if (packageManager === "yarn") {
    spawn.sync("yarn", ["add", ...bundleNames, "--silent"], {
      stdio: "inherit"
    });
  } else {
    spawn.sync("npm", ["install", ...bundleNames, "--silent"], {
      stdio: "inherit"
    });
  }
}

function compileMagicTypes() {
  // Prereq Check
  if (!inputFile) {
    fatalError("Please specify input file by using `-i` or `--inputFile`.");
  }

  if (!outputDir) {
    fatalError(
      "Please specify output directory by using `-o` or `--outputDir`."
    );
  }

  // Install Dependencies
  console.log(chalk.yellowBright("\n- 🔧 Install Dependencies...\n"));
  console.log(
    chalk.yellowBright("  MagicType requires following dependencies:\n")
  );
  console.log(
    [
      `  - @manta-style/runtime@${mantaStyleVersion}`,
      `  - @manta-style/typescript-helpers@${mantaStyleVersion}`
    ].join("\n")
  );
  console.log("\n");

  packageManagerInstall(
    `@manta-style/runtime@${mantaStyleVersion}`,
    `@manta-style/typescript-helpers@${mantaStyleVersion}`
  );
  console.log(chalk.yellowBright("\n- 📖 Compile Your Type Definitions...\n"));

  const result = build({
    fileName: path.resolve(inputFile),
    destDir: path.resolve(outputDir),
    transpileModule
  });

  console.log(result);

  console.log(
    chalk.yellowBright(
      "\n- 🎉 Done, now you can use your type definitions at runtime. \n"
    )
  );
  generateSuperGuideBasedOnFile(path.resolve(inputFile));

  console.log(
    chalk.yellowBright(
      "\n- ✨ Enjoy Magic Type (https://github.com/Cryrivers/magic-type)\n"
    )
  );
}

try {
  compileMagicTypes();
} catch (ex) {
  console.error(ex);
}
