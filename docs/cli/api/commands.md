# Commands

## Available Commands

- [`init`](/cli/api/commands/init) Creates configuration file.
- [`generate`](/cli/api/commands/generate) Generates code based on configuration, using `contracts` and `plugins`.
- [`test`](/cli/api/commands/test) Runs tests based on configuration.

## Display Info

### `-h`, `--help`

Show help message when `-h`, `--help` flags appear.

::: code-group
```bash [pnpm]
pnpm wagmi --help
```

```bash [npm]
npx wagmi --help
```

```bash [yarn]
yarn wagmi --help
```

```bash [bun]
bun wagmi --help
```
:::

### `-v`, `--version`

Show version number when `-v`, `--version` flags appear.

::: code-group
```bash [pnpm]
pnpm wagmi --version
```

```bash [npm]
npx wagmi --version
```

```bash [yarn]
yarn wagmi --version
```

```bash [bun]
bun wagmi --version
```
:::

## Test Command

The `test` command runs tests based on the configuration provided.

### Usage

```bash
wagmi test
```

### Options

#### -c, --config <path>

`string`

Path to config file.

```bash
wagmi test --config wagmi.config.ts
```

#### -r, --root <path>

`string`

Root path to resolve config from.

```bash
wagmi test --root path/to/root
```

#### -w, --watch

`boolean`

Watch for changes and re-run tests.

```bash
wagmi test --watch
```

#### -h, --help

Displays help message.

```bash
wagmi test --help
```
