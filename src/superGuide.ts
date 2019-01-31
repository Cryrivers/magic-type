import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { highlight } from "cli-highlight";
import * as boxen from "boxen";

export function generateSuperGuideBasedOnFile(filePath: string) {
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
          `import { ${typeName} } from './${moduleName}';
    
// Use Magic Types as normal TypeScript types
type MyType = {
    key: ${typeName}
};
    
// Use Magic Type at Runtime

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
