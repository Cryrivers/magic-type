const typescript = require("rollup-plugin-typescript");
const json = require("rollup-plugin-json");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonJs = require("rollup-plugin-commonjs");
const packageJson = require("./package.json");

const external = [
  ...Object.keys(packageJson.dependencies),
  "path",
  "fs",
  "process",
  "child_process",
  "util",
  "events",
  "tty",
  "assert",
  "os"
];

module.exports = {
  external,
  input: "src/index.ts",
  output: {
    file: "lib/bundle.js",
    banner: "#!/usr/bin/env node",
    format: "cjs"
  },
  plugins: [nodeResolve(), commonJs(), typescript(), json()]
};
