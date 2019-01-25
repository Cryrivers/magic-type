<h1 align="center">
  Magic Type
</h1>
<p align="center">🎩 Use Your TypeScript definitions at runtime. Powered by <a href="https://github.com/Cryrivers/manta-style" target="_blank">Manta Style</a>.</p>
<p align="center">
<img src="https://img.shields.io/npm/v/magic-type.svg?style=flat-square" alt="version">
</p>

---

# Installation

- With Yarn

```sh
yarn global add magic-type
```

- With NPM

```sh
npm install -g magic-type
```

You could also use Magic Type locally as well.

# Usage

Let's take the following code as an example.

```typescript
// typings/api.ts
export type MyAPIRequest = {
  time: number;
  input: string;
};
```

## Compile TypeScript definitions

[![asciicast](https://asciinema.org/a/VAwlNHFdww9mqracrAJJDWTlf.png)](https://asciinema.org/a/VAwlNHFdww9mqracrAJJDWTlf?speed=0.85)

```
Usage: magictype [options]

Options:
  -V, --version          output the version number
  -i --inputFile <file>  The entrypoint of files to be compiled
  -o --outputDir <dir>   The output directory of compiled files
  -c --cjs               Transpile modules to CommonJS (Otherwise it will output ES modules)
  -h, --help             output usage information
```

## Use magic types at runtime

```typescript
import { MyAPIRequest } from "./api";

// Use Magic Types as normal TypeScript types
type MyType = {
  key: MyAPIRequest;
};

// Use Magic Type at Runtime

// Check if user input matches MyAPIRequest
function checkMyInput(input: any) {
  return MyAPIRequest.validate(input);
}

// Format user input to match MyAPIRequest
function formatMyInput(input: any) {
  return MyAPIRequest.format(input);
}

// Generate a mock MyAPIRequest data
function getMockData() {
  return MyAPIRequest.deriveLiteral([]).mock();
}
```

- Developer Experience with TypeScript's [type guard](https://basarat.gitbooks.io/typescript/docs/types/typeGuard.html#user-defined-type-guards)
  ![Developer Experience](https://raw.githubusercontent.com/Cryrivers/magic-type/master/media/dev-experience.png)

- Actual Screenshot:
  ![Actual Screenshot](https://raw.githubusercontent.com/Cryrivers/magic-type/master/media/magic-type-runtime-example.png)

# Unsupported Syntax

Please be noted there's no warnings against unsupported syntax yet (And Magic Type may crash as well).
Please kindly check by yourself.

- `extends` keyword in `interface` declaration will be ignored.
- Union (`A | B`) and intersection(`A & B`) on index signatures are not supported.
- Functions
- `infer` keyword
- `ReturnType<T>` and `InstanceType<T>` are not supported due to unsupported `infer` keyword and functions.

# License

Magic Type is [MIT licensed](https://github.com/Cryrivers/magic-type/blob/master/LICENSE)
