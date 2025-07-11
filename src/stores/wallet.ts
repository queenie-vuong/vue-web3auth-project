import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getNetworkByDecimalId, type NetworkConfig } from '@/config/networks'

export type ConnectionType = 'web3auth' | 'walletconnect' | null

interface WalletState {
  address: string | null
  chainId: number | null
  connectionType: ConnectionType
  balance: string | null
}

export const useWalletStore = defineStore('wallet', () => {
  const address = ref<string | null>(null)
  const chainId = ref<number | null>(null)
  const connectionType = ref<ConnectionType>(null)
  const balance = ref<string | null>(null)

  const isConnected = computed(() => {
    return !!address.value && !!connectionType.value
  })

  const isWeb3AuthConnected = computed(() => {
    return connectionType.value === 'web3auth'
  })

  const isWalletConnectConnected = computed(() => {
    return connectionType.value === 'walletconnect'
  })

  const currentNetwork = computed<NetworkConfig | null>(() => {
    if (!chainId.value) return null
    
    const network = getNetworkByDecimalId(chainId.value)
    if (network) return network
    
    // Fallback for unknown networks
    return {
      chainId: `0x${chainId.value.toString(16)}`,
      chainIdDecimal: chainId.value,
      name: `chain-${chainId.value}`,
      displayName: `Chain ${chainId.value}`,
      rpcUrl: '',
      blockExplorer: '',
      ticker: 'Unknown',
      tickerName: 'Unknown'
    }
  })

  const setWalletState = (state: Partial<WalletState>) => {
    console.log('WalletStore: setWalletState called with:', state)
    if (state.address !== undefined) address.value = state.address
    if (state.chainId !== undefined) chainId.value = state.chainId
    if (state.connectionType !== undefined) connectionType.value = state.connectionType
    if (state.balance !== undefined) balance.value = state.balance
    console.log('WalletStore: State after update:', {
      address: address.value,
      chainId: chainId.value,
      connectionType: connectionType.value,
      isConnected: isConnected.value,
      isWalletConnectConnected: isWalletConnectConnected.value,
      isWeb3AuthConnected: isWeb3AuthConnected.value
    })
  }

  const clearWalletState = () => {
    address.value = null
    chainId.value = null
    connectionType.value = null
    balance.value = null
  }

  return {
    // State
    address,
    chainId,
    connectionType,
    balance,
    
    // Computed
    isConnected,
    isWeb3AuthConnected,
    isWalletConnectConnected,
    currentNetwork,
    
    // Actions
    setWalletState,
    clearWalletState
  }
})