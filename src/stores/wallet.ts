import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  const currentNetwork = computed(() => {
    if (!chainId.value) return null
    
    const networks: Record<number, { name: string; currency: string }> = {
      84532: { name: 'Base Sepolia', currency: 'ETH' },
      1: { name: 'Ethereum Mainnet', currency: 'ETH' },
      11155111: { name: 'Sepolia Testnet', currency: 'ETH' },
      137: { name: 'Polygon', currency: 'MATIC' },
      80001: { name: 'Mumbai', currency: 'MATIC' }
    }
    
    return networks[chainId.value] || { name: `Chain ${chainId.value}`, currency: 'Unknown' }
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