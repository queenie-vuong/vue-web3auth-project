import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { injected, walletConnect } from '@wagmi/connectors'

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http('https://eth.llamarpc.com', {
      batch: false,
    }),
    [sepolia.id]: http('https://rpc.sepolia.org', {
      batch: false,
    }),
  },
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
      metadata: {
        name: 'Vue Web3Auth Project',
        description: 'Web3Auth integration with Vue',
        url: 'http://localhost:5173',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    }),
  ],
  ssr: false,
})
