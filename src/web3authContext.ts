/* eslint-disable @typescript-eslint/no-explicit-any */
import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from '@web3auth/base'
import { WalletConnectV2Adapter } from '@web3auth/wallet-connect-v2-adapter'

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

// Create WalletConnect V2 adapter
const walletConnectV2Adapter = new WalletConnectV2Adapter({
  adapterSettings: {
    qrcodeModal: {
      mobileLinks: [
        "rainbow",
        "metamask",
        "argent",
        "trust",
        "imtoken",
        "pillar",
      ],
    },
  },
  loginSettings: {
    projectId: walletConnectProjectId,
  },
} as any) // Using 'as any' to bypass TypeScript issues with the adapter types

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x1",
      rpcTarget: "https://eth.llamarpc.com",
    },
    uiConfig: {
      appName: "Vue Web3Auth Project",
      theme: {
        primary: "#2563eb",
      },
      defaultLanguage: "en" as const,
      mode: "light" as const,
      loginMethodsOrder: ["google", "facebook", "twitter", "discord", "email_passwordless", "wallet_connect_v2"],
      useLogoLoader: true
    },
    modalConfig: {
      connectors: {
        metamask: {
          label: 'Metamask',
          showOnModal: true,
        },
        'wallet-connect-v2': { label: 'Wallet Connect v2', showOnModal: true },
        coinbase: { label: 'coinbase', showOnModal: false },
        auth: { label: 'Auth', showOnModal: true },
      },
    },
  },
  adapters: [walletConnectV2Adapter],
}
