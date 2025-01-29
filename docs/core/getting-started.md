<script setup>
import packageJson from '../../packages/core/package.json'

const viemVersion = packageJson.peerDependencies.viem
</script>

# Getting Started

## Overview

Wagmi Core is a VanillaJS library for Ethereum. You can learn more about the rationale behind the project in the [Why Wagmi](/core/why) section.

## Manual Installation

To manually add Wagmi to your project, install the required packages.

::: code-group
```bash-vue [pnpm]
pnpm add @wagmi/core @wagmi/connectors viem@{{viemVersion}} prettier eslint vitest
```

```bash-vue [npm]
npm install @wagmi/core @wagmi/connectors viem@{{viemVersion}} prettier eslint vitest
```

```bash-vue [yarn]
yarn add @wagmi/core @wagmi/connectors viem@{{viemVersion}} prettier eslint vitest
```

```bash-vue [bun]
bun add @wagmi/core @wagmi/connectors viem@{{viemVersion}} prettier eslint vitest
```
:::

- [Wagmi Connectors](/core/api/connectors) is a collection of interfaces for linking accounts/wallets to Wagmi.
- [Viem](https://viem.sh) is a TypeScript interface for Ethereum that performs blockchain operations.
- [TypeScript](/react/typescript) is optional, but highly recommended. Learn more about [TypeScript support](/core/typescript).

### Create Config

Create and export a new Wagmi config using `createConfig`.

::: code-group
<<< @/snippets/core/config.ts[config.ts]
:::

In this example, Wagmi is configured to use the Mainnet and Sepolia chains. Check out the [`createConfig` docs](/core/api/createConfig) for more configuration options.

### Use Wagmi

Now that everything is set up, you can pass the `config` to use actions.

::: code-group
```tsx [index.ts]
import { getAccount, getEnsName } from '@wagmi/core'
import { config } from './config'

const { address } = getAccount(config)
const ensName = await getEnsName(config, { address })
```
<<< @/snippets/core/config.ts[config.ts]
:::

## Run Prettier and ESLint

To ensure code quality and consistency, you can use Prettier for code formatting and ESLint for linting. Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "prettier:format": "prettier --write .",
    "eslint:lint": "eslint . --ext .js,.ts,.tsx"
  }
}
```

Run the following commands to format and lint your code:

::: code-group
```bash [pnpm]
pnpm prettier:format
pnpm eslint:lint
```

```bash [npm]
npm run prettier:format
npm run eslint:lint
```

```bash [yarn]
yarn prettier:format
yarn eslint:lint
```

```bash [bun]
bun run prettier:format
bun run eslint:lint
```
:::

## Run Tests Using Vitest

To run tests using Vitest, add the following script to your `package.json`:

```json
{
  "scripts": {
    "test:run": "vitest run"
  }
}
```

Run the following command to execute the tests:

::: code-group
```bash [pnpm]
pnpm test:run
```

```bash [npm]
npm run test:run
```

```bash [yarn]
yarn test:run
```

```bash [bun]
bun run test:run
```
:::

## Next Steps

For more information on what to do next, check out the following topics.

- [**TypeScript**](/core/typescript) Learn how to get the most out of Wagmi's type-safety and inference for an enlightened developer experience.
- [**Actions**](/core/api/actions) Browse the collection of actions and learn how to use them.
- [**Framework Adapters**](/core/guides/framework-adapters) Learn how to create a Wagmi-like adapter for your favorite framework.
- [**Viem docs**](https://viem.sh) Wagmi Core is a wrapper around Viem that manages account and client reactivity. Learn more about Viem and how to use it.
