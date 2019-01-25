<h1 align="center">
  Magic Type
</h1>
<p align="center">🚀 Use Your TypeScript definitions at runtime. Powered by <a href="https://github.com/Cryrivers/manta-style" target="_blank">Manta Style</a>.</p>

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

You can also use Magic Type locally as well.

# Usage

## Compile TypeScript definitions

[![asciicast](https://asciinema.org/a/n3u9Z9x8Nki3C6OApnf6CFaDi.png)](https://asciinema.org/a/n3u9Z9x8Nki3C6OApnf6CFaDi?speed=0.5)

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

# License

Magic Type is [MIT licensed](https://github.com/Cryrivers/magic-type/blob/master/LICENSE)
