import { type NetworkConfig } from '@/config/networks'
import type { Connector } from '@wagmi/core'

export async function switchNetwork(
  connector: Connector | undefined,
  network: NetworkConfig
): Promise<void> {
  if (!connector) {
    throw new Error('No connector available')
  }

  const provider = await connector.getProvider()
  if (!provider || typeof provider !== 'object' || !('request' in provider)) {
    throw new Error('Invalid provider')
  }
  
  // Type assertion for provider with request method
  const ethProvider = provider as { request: (args: { method: string; params: unknown[] }) => Promise<unknown> }

  try {
    // Try switching to the network
    await ethProvider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    })
  } catch (switchError) {
    // Error code 4902 means the chain has not been added to the wallet
    if ((switchError as { code?: number }).code === 4902) {
      try {
        // Add the network to the wallet
        await ethProvider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.displayName,
            nativeCurrency: {
              name: network.tickerName,
              symbol: network.ticker,
              decimals: 18
            },
            rpcUrls: [network.rpcUrl],
            blockExplorerUrls: [network.blockExplorer]
          }]
        })
      } catch (addError) {
        throw new Error(`Failed to add network: ${addError}`)
      }
    } else {
      throw new Error(`Failed to switch network: ${switchError}`)
    }
  }
}