const typescript = require("rollup-plugin-typescript");
const json = require("rollup-plugin-json");
const nodeResolve = require("rollup-plugin-node-resolve");
const commonJs = require("rollup-plugin-commonjs");

module.exports = {
  external: [
    "path",
    "fs",
    "process",
    "child_process",
    "util",
    "events",
    "tty",
    "assert",
    "os"
  ],
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    banner: "#!/usr/bin/env node",
    format: "cjs"
  },
  plugins: [nodeResolve(), commonJs(), typescript(), json()]
};
