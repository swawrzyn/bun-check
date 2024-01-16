# bun-check

## Description

A simple library to throw onto the top of your bun files to guard against that pesky node.js runtime or old versions of bun. Zero-dependency, utilizes Bun native `Bun.semver` for comparisions.

## How to use
```bash
$ bun install bun-check
```

```typescript
import { bunCheck } from "bun-check";
// or
import bunCheck from "bun-check";

const opts = {
  desiredVersion: ">=1.0.0",
  error: ({message}) => {
    console.log("go away node.js or old bun.");
    process.exit();
  },
}

bunCheck(opts);
```

## Options

```typescript
type BunCheckOptions = {
  desiredVersion?: string; // the desired version you want, see Bun.semver API [1]
  error?: ({ message }: { message: string }) => void; // function either throws (default) or if provided an error callback, will fire that instead
}
```

[1] [Bun Semver API](https://bun.sh/docs/api/semver)


### Happy baking!