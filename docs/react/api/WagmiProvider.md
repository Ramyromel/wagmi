# WagmiProvider

React Context Provider for Wagmi.

## Import

```ts
import { WagmiProvider } from 'wagmi'
```

## Usage

::: code-group
```tsx [app.tsx]
import { WagmiProvider } from 'wagmi'
import { config } from './config' 

function App() {
  return (
    <WagmiProvider config={config}> 
      {/** ... */}
    </WagmiProvider>
  )
}
```
<<< @/snippets/react/config.ts[config.ts]
:::

## Parameters

```ts
import { type WagmiProviderProps } from 'wagmi'
```

### config

[`Config`](/react/api/createConfig#config) object to inject with context.

::: code-group
```tsx [app.tsx]
import { WagmiProvider } from 'wagmi'
import { config } from './config' 

function App() {
  return (
    <WagmiProvider
      config={config} // [!code focus]
    >
      {/** ... */}
    </WagmiProvider>
  )
}
```
<<< @/snippets/react/config.ts[config.ts]
:::

### initialState

`State | undefined`

- Initial state to hydrate into the [Wagmi Config](/react/api/createConfig). Useful for SSR.

::: code-group
```tsx [app.tsx]
import { WagmiProvider } from 'wagmi'
import { config } from './config' 

function App() {
  return (
    <WagmiProvider
      config={config}
      initialState={/* ... /*} // [!code focus]
    >
      {/** ... */}
    </WagmiProvider>
  )
}
```
<<< @/snippets/react/config.ts[config.ts]
:::

### reconnectOnMount

`boolean | undefined`

- Whether or not to reconnect previously connected [connectors](/react/api/createConfig#connectors) on mount.
- Defaults to `true`.

::: code-group
```tsx [app.tsx]
import { WagmiProvider } from 'wagmi'
import { config } from './config' 

function App() {
  return (
    <WagmiProvider
      config={config}
      reconnectOnMount={false} // [!code focus]
    >
      {/** ... */}
    </WagmiProvider>
  )
}
```
<<< @/snippets/react/config.ts[config.ts]
:::

## Context

```ts
import { type WagmiContext } from 'wagmi'
```

## Setting up the WagmiProvider

To set up the `WagmiProvider` with the appropriate configuration, follow these steps:

1. Import the `WagmiProvider` from the `wagmi` package.
2. Create a configuration object using the `createConfig` function from the `wagmi` package.
3. Wrap your application in the `WagmiProvider` and pass the configuration object as a prop.

```tsx
import { WagmiProvider, createConfig } from 'wagmi'

const config = createConfig({
  // Your configuration options here
})

function App() {
  return (
    <WagmiProvider config={config}>
      {/** ... */}
    </WagmiProvider>
  )
}
```

For more details on creating the configuration object, refer to the documentation in `docs/react/api/createConfig.md`.
