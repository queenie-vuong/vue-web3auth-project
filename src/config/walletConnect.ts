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
    const { mainnet, sepolia, baseSepolia } = await import('@reown/appkit/networks')
    const { WagmiAdapter } = await import('@reown/appkit-adapter-wagmi')
    
    // Create wagmi adapter with Base Sepolia as the default network
    // In dev environment, only allow Base Sepolia
    const networks = import.meta.env.DEV 
      ? [baseSepolia] 
      : [baseSepolia, mainnet, sepolia]
    
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
        email: true,
        emailShowWallets: true
      },
      themeMode: 'light',
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
      ]
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
  }
}