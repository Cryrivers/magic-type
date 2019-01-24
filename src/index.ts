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
    "-t --transpileToCjs",
    "Transpile modules to CommonJS",
    undefined,
    true
  )
  .parse(process.argv);

const mantaStyleVersion = packageJson.dependencies[
  "@manta-style/builder-typescript"
].replace(/[^\~]/, "");

const { inputFile, outputDir, transpileToCjs: transpileModule } = program;

console.log("Input File:", inputFile), console.log("Output Dir:", outputDir);

function detectPackageManager(): "yarn" | "npm" {
  const projectRoot = findRoot(process.cwd());
  return fs.existsSync(path.join(projectRoot, "yarn.lock")) ? "yarn" : "npm";
}

function compileMagicTypes() {
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
  const packageManager = detectPackageManager();
  if (packageManager === "yarn") {
    spawn.sync(
      "yarn",
      [
        "add",
        `@manta-style/runtime@${mantaStyleVersion}`,
        `@manta-style/typescript-helpers@${mantaStyleVersion}`,
        "--silent"
      ],
      { stdio: "inherit" }
    );
  } else {
    spawn.sync(
      "npm",
      [
        "install",
        `@manta-style/runtime@${mantaStyleVersion}`,
        `@manta-style/typescript-helpers@${mantaStyleVersion}`,
        "--silent"
      ],
      { stdio: "inherit" }
    );
  }
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
