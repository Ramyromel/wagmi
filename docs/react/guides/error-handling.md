# Error Handling

The `error` property in Wagmi Hooks is strongly typed with it's corresponding error type. This enables you to have granular precision with handling errors in your application.

You can discriminate the error type by using the `name` property on the error object.

::: code-group
```tsx twoslash [index.tsx]
// @noErrors
import { useBlockNumber } from 'wagmi'

function App() {
  const { data, error } = useBlockNumber()
  //            ^?

  error?.name
  //     ^?

  if (error?.name === 'HttpRequestError') {
    const { status } = error
    //      ^?      
    return <div>A HTTP error occurred. Status: {status}</div>
  }
  if (error?.name === 'LimitExceededRpcError') {
    const { code } = error
    //      ^?
    return <div>Rate limit exceeded. Code: {code}</div>
  }
  // ...
}
```
<<< @/snippets/react/config.ts[config.ts]
:::

Refer to the specific hook documentation for detailed usage and error handling examples. For instance, the `useBlockNumber` hook documentation in `docs/react/api/hooks/useBlockNumber.md` provides an example of how to handle errors using the `error` property.

Ensure that you have set up the Wagmi configuration and wrapped your application in the `WagmiProvider` as shown in `docs/react/api/WagmiProvider.md`. This ensures that the context is properly set up for error handling and other functionalities.

Utilize TanStack Query features like query invalidation, prefetching, and SSR as described in the `docs/react/guides/tanstack-query.md` to enhance your application's data fetching and caching capabilities, which can help in handling errors more effectively.
