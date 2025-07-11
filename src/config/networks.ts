export interface NetworkConfig {
  chainId: string
  chainIdDecimal: number
  name: string
  displayName: string
  rpcUrl: string
  blockExplorer: string
  ticker: string
  tickerName: string
  logo?: string
}

export const SUPPORTED_NETWORKS: Record<string, NetworkConfig> = {
  '0x1': {
    chainId: '0x1',
    chainIdDecimal: 1,
    name: 'mainnet',
    displayName: 'Ethereum Mainnet',
    rpcUrl: 'https://rpc.ankr.com/eth',
    blockExplorer: 'https://etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    chainIdDecimal: 11155111,
    name: 'sepolia',
    displayName: 'Sepolia Testnet',
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
    blockExplorer: 'https://sepolia.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Sepolia ETH',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
  },
  '0x14a34': {
    chainId: '0x14a34',
    chainIdDecimal: 84532,
    name: 'base-sepolia',
    displayName: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    blockExplorer: 'https://sepolia.basescan.org',
    ticker: 'ETH',
    tickerName: 'Base Sepolia ETH',
    logo: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4'
  },
  '0x2105': {
    chainId: '0x2105',
    chainIdDecimal: 8453,
    name: 'base',
    displayName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    ticker: 'ETH',
    tickerName: 'Base ETH',
    logo: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4'
  },
  '0x89': {
    chainId: '0x89',
    chainIdDecimal: 137,
    name: 'polygon',
    displayName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    ticker: 'MATIC',
    tickerName: 'Polygon',
    logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png'
  },
  '0xa4b1': {
    chainId: '0xa4b1',
    chainIdDecimal: 42161,
    name: 'arbitrum',
    displayName: 'Arbitrum One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    ticker: 'ETH',
    tickerName: 'Arbitrum ETH',
    logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png'
  },
  '0xa': {
    chainId: '0xa',
    chainIdDecimal: 10,
    name: 'optimism',
    displayName: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Optimism ETH',
    logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png'
  },
  '0x3e6': {
    chainId: '0x3e6',
    chainIdDecimal: 998,
    name: 'hyperevm-testnet',
    displayName: 'HyperEVM Testnet',
    rpcUrl: 'https://rpc.hyperliquid-testnet.xyz/evm',
    blockExplorer: 'https://explorer.hyperliquid-testnet.xyz',
    ticker: 'ETH',
    tickerName: 'HyperEVM ETH',
    logo: 'https://docs.hyperliquid.xyz/img/logo.svg'
  }
}

export const DEFAULT_NETWORK = '0x14a34' // Base Sepolia

export function getNetworkConfig(chainId: string): NetworkConfig | undefined {
  return SUPPORTED_NETWORKS[chainId]
}

export function getNetworkByDecimalId(chainIdDecimal: number): NetworkConfig | undefined {
  return Object.values(SUPPORTED_NETWORKS).find(
    network => network.chainIdDecimal === chainIdDecimal
  )
}