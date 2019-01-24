import { build } from "@manta-style/builder-typescript";
import * as fs from "fs";
import * as path from "path";
import * as process from "process";
import * as program from "commander";
import * as packageJson from "../package.json";
import * as spawn from "cross-spawn";

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
  const packageManager = detectPackageManager();
  if (packageManager === PackageManager.YARN) {
    spawn("yarn", [
      "add",
      "@manta-style/runtime",
      "@manta-style/typescript-helpers"
    ]);
  } else {
    spawn("npm", [
      "install",
      "@manta-style/runtime",
      "@manta-style/typescript-helpers"
    ]);
  }
  build({
    fileName: input,
    destDir: outputDir,
    transpileModule
  });
}

try {
  compileMagicTypes();
} catch {
  console.error("Cannot find `package.json` file in your project.");
}
