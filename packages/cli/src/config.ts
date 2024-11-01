import { type Abi } from 'abitype'
import { type Address } from 'viem'

import { type Evaluate, type MaybeArray, type MaybePromise } from './types.js'

/**
 * Configuration for a contract.
 * 
 * @template chainId - The chain ID type.
 * @template requiredChainId - The required chain ID type.
 */
export type ContractConfig<
  chainId extends number = number,
  requiredChainId extends number | undefined = undefined,
> = {
  /**
   * Contract ABI
   */
  abi: Abi
  /**
   * Contract address or addresses.
   *
   * Accepts an object `{ [chainId]: address }` to support multiple chains.
   *
   * @example
   * '0x314159265dd8dbb310642f98f50c066173c1259b'
   *
   * @example
   * {
   *   1: '0x314159265dd8dbb310642f98f50c066173c1259b',
   *   5: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
   * }
   */
  address?:
    | Address
    | (requiredChainId extends number
        ? Record<requiredChainId, Address> & Partial<Record<chainId, Address>>
        : Record<chainId, Address>)
    | undefined
  /**
   * Name of contract.
   */
  name: string
}

/**
 * Represents a contract with additional metadata.
 */
export type Contract = Evaluate<
  ContractConfig & {
    /** Generated string content */
    content: string
    /** Meta info about contract */
    meta: {
      abiName: string
      addressName?: string | undefined
      configName?: string | undefined
    }
  }
>

/**
 * Configuration for watching file changes.
 */
export type Watch = {
  /** Command to run along with watch process */
  command?: (() => MaybePromise<void>) | undefined
  /** Paths to watch for changes. */
  paths: string[] | (() => MaybePromise<string[]>)
  /** Callback that fires when file is added */
  onAdd?:
    | ((path: string) => MaybePromise<ContractConfig | undefined>)
    | undefined
  /** Callback that fires when file changes */
  onChange: (path: string) => MaybePromise<ContractConfig | undefined>
  /** Callback that fires when watcher is shutdown */
  onClose?: (() => MaybePromise<void>) | undefined
  /** Callback that fires when file is removed */
  onRemove?: ((path: string) => MaybePromise<string | undefined>) | undefined
}

/**
 * Represents a plugin with various hooks and configurations.
 */
export type Plugin = {
  /** Contracts provided by plugin */
  contracts?: (() => MaybePromise<ContractConfig[]>) | undefined
  /** Plugin name */
  name: string
  /** Run plugin logic */
  run?:
    | ((config: {
        /** All resolved contracts from config and plugins */
        contracts: Contract[]
        /** Whether TypeScript is detected in project */
        isTypeScript: boolean
        /** Previous plugin outputs */
        outputs: readonly {
          plugin: Pick<Plugin, 'name'>
          imports?: string
          prepend?: string
          content: string
        }[]
      }) => MaybePromise<{
        imports?: string
        prepend?: string
        content: string
      }>)
    | undefined
  /**
   * Validate plugin configuration or other @wagmi/cli settings require for plugin.
   */
  validate?: (() => MaybePromise<void>) | undefined
  /** File system watch config */
  watch?: Watch | undefined
}

/**
 * Configuration for the CLI.
 */
export type Config = {
  /** Contracts to use in commands */
  contracts?: ContractConfig[] | undefined
  /** Output file path */
  out: string
  /** Plugins to run */
  plugins?: Plugin[] | undefined
}

/**
 * Defines the configuration for the CLI.
 * 
 * @param config - The configuration object or function.
 * @returns The configuration.
 */
export function defineConfig(
  config: MaybeArray<Config> | (() => MaybePromise<MaybeArray<Config>>),
) {
  return config
}

/**
 * Default configuration for the CLI.
 */
export const defaultConfig = {
  out: 'src/generated.ts',
  contracts: [],
  plugins: [],
} satisfies Config
