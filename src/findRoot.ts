import * as path from "path";
import * as fs from "fs";

function defaultCheck(dir: string) {
  return fs.existsSync(path.join(dir, "package.json"));
}

export function findRoot(
  start: string | string[],
  check: (dir: string) => boolean = defaultCheck
): string {
  if (typeof start === "string") {
    if (start[start.length - 1] !== path.sep) {
      start += path.sep;
    }
    start = start.split(path.sep);
  }
  if (!start.length) {
    throw new Error("package.json not found in path");
  }
  start.pop();
  var dir = start.join(path.sep);
  try {
    if (check(dir)) {
      return dir;
    }
  } catch (e) {}
  return findRoot(start, check);
}
