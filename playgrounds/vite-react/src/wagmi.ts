import { http } from 'viem'
import { mainnet, optimism, sepolia } from 'viem/chains'
import 'viem/window'
import { createConfig, createStorage } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, optimism],
  connectors: [
    injected({ wallet: 'metaMask' }),
    injected({ wallet: 'coinbaseWallet' }),
    injected({ wallet: 'phantom' }),
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
      metadata: {
        name: 'Vite React Playground',
        description: 'Vite React React playground for wagmi',
        url: 'http://localhost:5173',
        icons: [''],
      },
    }),
    coinbaseWallet({ appName: 'Vite React Playground', darkMode: true }),
  ],
  storage: createStorage({ storage: localStorage, key: 'vite-react' }),
  transports: {
    // [mainnet.id]: fallback([
    //   custom(window.ethereum!),
    //   http(
    //     'https://eth-mainnet.g.alchemy.com/v2/StF61Ht3J9nXAojZX-b21LVt9l0qDL38',
    //   ),
    // ]),
    [mainnet.id]: http(
      'https://eth-mainnet.g.alchemy.com/v2/StF61Ht3J9nXAojZX-b21LVt9l0qDL38',
    ),
    [sepolia.id]: http(
      'https://eth-sepolia.g.alchemy.com/v2/roJyEHxkj7XWg1T9wmYnxvktDodQrFAS',
    ),
    [optimism.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
