import { WEB3AUTH_NETWORK, CHAIN_NAMESPACES } from '@web3auth/base'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID

// Create OpenLogin adapter with Google-only configuration
const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      appName: "Vue Web3Auth Project",
      logoLight: "https://web3auth.io/images/web3auth-logo.svg",
      logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
      defaultLanguage: "en",
      mode: "light",
    },
    loginConfig: {
      google: {
        name: "Google Login",
        verifier: "google",
        typeOfLogin: "google",
        showOnModal: true,
      },
    },
  },
})

export const web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x14a34", // Base Sepolia (84532)
      rpcTarget: "https://sepolia.base.org",
      displayName: "Base Sepolia",
      blockExplorer: "https://sepolia.basescan.org",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
    uiConfig: {
      appName: "Vue Web3Auth Project",
      theme: {
        primary: "#2563eb",
      },
      defaultLanguage: "en" as const,
      mode: "light" as const,
      loginMethodsOrder: ["google"],
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
        auth: { label: 'Social Login', showOnModal: true },
      },
    },
  },
  adapters: [openloginAdapter],
}
