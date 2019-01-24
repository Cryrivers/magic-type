import { build } from "@manta-style/builder-typescript";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import * as program from "commander";
import * as packageJson from "../package.json";
import * as spawn from "cross-spawn";
import chalk from "chalk";
import { highlight } from "cli-highlight";

import findRoot = require("find-root");

program
  .version(packageJson.version)
  .option("-i --inputFile <file>", "The entrypoint of files to be compiled")
  .option("-o --outputDir <dir>", "The output directory of compiled files")
  .option(
    "-t --transpileToCjs",
    "Transpile modules to CommonJS",
    undefined,
    true
  );

const { input, outputDir, transpileToCjs: transpileModule } = program;
const enum PackageManager {
  NPM,
  YARN
}

function detectPackageManager() {
  const projectRoot = findRoot(process.cwd());
  return fs.existsSync(path.join(projectRoot, "yarn.lock"))
    ? PackageManager.YARN
    : PackageManager.NPM;
}

function compileMagicTypes() {
  console.log(
    chalk.yellowBright("\n- Install Dependencies Required by MagicType...\n")
  );
  const packageManager = detectPackageManager();
  if (packageManager === PackageManager.YARN) {
    spawn.sync(
      "yarn",
      [
        "add",
        `@manta-style/runtime@${packageJson.version}`,
        `@manta-style/typescript-helpers@${packageJson.version}`
      ],
      { stdio: "inherit" }
    );
  } else {
    spawn.sync(
      "npm",
      [
        "install",
        `@manta-style/runtime@${packageJson.version}`,
        `@manta-style/typescript-helpers@${packageJson.version}`
      ],
      { stdio: "inherit" }
    );
  }
  console.log(chalk.yellowBright("\n- Compile Your Type Definitions...\n"));

  const result = build({
    fileName: input,
    destDir: outputDir,
    transpileModule
  });

  console.log(result);

  console.log(
    chalk.yellowBright(
      "\n- Done, now you can use your type definitions at runtime. \n"
    )
  );
  console.log(
    highlight(
      `
  import { Type } from './a';

  // Use Magic Type as TypeScript types
  type MyType = {
      key: Type
  };

  // Use Magic Type as JavaScript object
  Type.validate(input);
  Type.deriveLiteral([]).mock();
  Type.format(input);
  `,
      { language: "typescript" }
    )
  );
}

try {
  compileMagicTypes();
} catch (ex) {
  console.error(ex);
}
