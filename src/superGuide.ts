import ts from "typescript";
import fs from "fs";
import path from "path";
import { highlight } from "cli-highlight";
import boxen from "boxen";
import camelCase from "lodash.camelcase";
import * as copyPaste from "copy-paste";

function makePluginVariableName(item: string) {
  return camelCase(item.replace("@manta-style/", ""));
}

function generateMantaStyleImport(enabledPlugins: string[]) {
  const hasPlugins = enabledPlugins.length > 0;
  return hasPlugins
    ? `/* Import plugins */
import { enablePlugins } from '@manta-style/core';
${enabledPlugins
  .map(item => `import ${makePluginVariableName(item)} from '${item}';`)
  .join("\n")}

/* Enable plugins selected */
enablePlugins([\n${enabledPlugins
        .map(
          item =>
            `  { name: '${item}', module: ${makePluginVariableName(item)} }`
        )
        .join(", \n")}\n]);

`
    : "";
}

export function copyMantaStyleImport(enabledPlugins: string[]) {
  copyPaste.copy(generateMantaStyleImport(enabledPlugins));
}

export function generateSuperGuideBasedOnFile(
  filePath: string,
  enabledPlugins: string[]
) {
  const code = fs.readFileSync(filePath, { encoding: "utf8" });
  const sourceFile = ts.createSourceFile(
    filePath,
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );

  const typeName = ts.forEachChild(sourceFile, node => {
    if (ts.isTypeAliasDeclaration(node)) {
      return node.name.text;
    }
  });

  const moduleName = path.basename(filePath).replace(/.[jt]sx?/, "");

  if (typeName) {
    console.log(
      boxen(
        highlight(
          `${generateMantaStyleImport(enabledPlugins)}
/* Import your magic types */
import { ${typeName} } from './${moduleName}';

/* Use Magic Types as normal TypeScript types */
type MyType = {
    key: ${typeName}
};
    
/* Use Magic Type at Runtime */

// Check if user input matches ${typeName}
function checkMyInput(input: any) {
    return ${typeName}.validate(input);
}

// Format user input to match ${typeName}
function formatMyInput(input: any) {
    return ${typeName}.format(input);
}

// Generate a mock ${typeName} data
function getMockData() {
    return ${typeName}.deriveLiteral([]).mock();
}
`,
          { language: "typescript" }
        ),
        { padding: 1, borderColor: "cyan" }
      )
    );
  }
}
