import { expect, test } from 'vitest'

import * as query from './query.js'

test('exports', () => {
  expect(Object.keys(query)).toMatchInlineSnapshot(`
    [
      "connectMutationOptions",
      "disconnectMutationOptions",
      "estimateFeesPerGasQueryKey",
      "estimateFeesPerGasQueryOptions",
      "estimateGasQueryKey",
      "estimateGasQueryOptions",
      "getBalanceQueryKey",
      "getBalanceQueryOptions",
      "getBlockQueryKey",
      "getBlockQueryOptions",
      "getBlockNumberQueryKey",
      "getBlockNumberQueryOptions",
      "getConnectorClientQueryKey",
      "getConnectorClientQueryOptions",
      "getEnsAddressQueryKey",
      "getEnsAddressQueryOptions",
      "getEnsAvatarQueryKey",
      "getEnsAvatarQueryOptions",
      "getEnsNameQueryKey",
      "getEnsNameQueryOptions",
      "getEnsResolverQueryKey",
      "getEnsResolverQueryOptions",
      "getTokenQueryKey",
      "getTokenQueryOptions",
      "getTransactionQueryKey",
      "getTransactionQueryOptions",
      "getWalletClientQueryKey",
      "getWalletClientQueryOptions",
      "readContractQueryKey",
      "readContractQueryOptions",
      "readContractsQueryKey",
      "readContractsQueryOptions",
      "reconnectMutationOptions",
      "sendTransactionMutationOptions",
      "signMessageMutationOptions",
      "signTypedDataMutationOptions",
      "switchAccountMutationOptions",
      "simulateContractQueryKey",
      "simulateContractQueryOptions",
      "switchChainMutationOptions",
      "waitForTransactionReceiptQueryKey",
      "waitForTransactionReceiptQueryOptions",
      "writeContractMutationOptions",
      "hashFn",
    ]
  `)
})