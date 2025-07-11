import type { AppKit } from '@reown/appkit'
import type { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

let appKit: AppKit | null = null
let wagmiAdapter: WagmiAdapter | null = null

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const walletConnectMetadata = {
  name: 'Vue Web3Auth Project',
  description: 'Vue 3 application with Web3Auth and WalletConnect integration',
  url: window.location.origin,
  icons: [`${window.location.origin}/favicon.ico`]
}

export const createWalletConnectModal = async () => {
  if (!appKit) {
    // Dynamic import to avoid SSR issues
    const { createAppKit } = await import('@reown/appkit')
    const { mainnet, sepolia, baseSepolia, base, polygon, arbitrum, optimism } = await import('@reown/appkit/networks')
    const { WagmiAdapter } = await import('@reown/appkit-adapter-wagmi')

    // Define HyperEVM testnet as a custom network
    const hyperevmTestnet = {
      id: 998,
      name: 'HyperEVM Testnet',
      nativeCurrency: { name: 'HyperEVM ETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://rpc.hyperliquid-testnet.xyz/evm'] },
        public: { http: ['https://rpc.hyperliquid-testnet.xyz/evm'] }
      },
      blockExplorers: {
        default: { name: 'HyperEVM Explorer', url: 'https://explorer.hyperliquid-testnet.xyz' }
      },
      testnet: true
    }

    // Create wagmi adapter with all supported networks
    const networks = [baseSepolia, mainnet, sepolia, base, polygon, arbitrum, optimism, hyperevmTestnet]

    wagmiAdapter = new WagmiAdapter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      networks: networks as any,
      projectId
    })

    // Subscribe to wagmi events
    wagmiAdapter.wagmiConfig.subscribe(
      (state) => state,
      (state) => {
        console.log('Wagmi state update:', state)
      }
    )

    appKit = createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      metadata: walletConnectMetadata,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      networks: networks as any,
      defaultNetwork: baseSepolia,
      features: {
        analytics: true,
        onramp: true,
        socials: ['google'],
        email: false
      },
      themeMode: 'light',
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '18450873f2910f5596a63430197e3c1613ab1385ada74a4963a62eec43bc381b', // Rabby
      ],
      includeWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '18450873f2910f5596a63430197e3c1613ab1385ada74a4963a62eec43bc381b', // Rabby
      ],
      allWallets: 'HIDE'
    })
  }
  return appKit
}

export const getWalletConnectModal = () => {
  return appKit
}

export const getWagmiAdapter = () => {
  return wagmiAdapter
}

// Chain configuration
export const supportedChains = {
  84532: {
    chainId: 84532,
    name: 'Base Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.basescan.org',
    rpcUrl: 'https://sepolia.base.org'
  },
  1: {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth.llamarpc.com'
  },
  11155111: {
    chainId: 11155111,
    name: 'Sepolia',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org'
  },
  8453: {
    chainId: 8453,
    name: 'Base',
    currency: 'ETH',
    explorerUrl: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org'
  },
  137: {
    chainId: 137,
    name: 'Polygon',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com'
  },
  42161: {
    chainId: 42161,
    name: 'Arbitrum One',
    currency: 'ETH',
    explorerUrl: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  10: {
    chainId: 10,
    name: 'Optimism',
    currency: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io',
    rpcUrl: 'https://mainnet.optimism.io'
  },
  998: {
    chainId: 998,
    name: 'HyperEVM Testnet',
    currency: 'ETH',
    explorerUrl: 'https://explorer.hyperliquid-testnet.xyz',
    rpcUrl: 'https://rpc.hyperliquid-testnet.xyz/evm'
  }
}
