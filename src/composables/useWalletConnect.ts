import { ref, onUnmounted } from 'vue'
import { createWalletConnectModal, getWagmiAdapter } from '@/config/walletConnect'
import { useWalletStore } from '@/stores/wallet'
import type { AppKit } from '@reown/appkit'
import type { PublicStateControllerState } from '@reown/appkit-controllers'
import type { State as WagmiState } from '@wagmi/core'

interface WalletConnectAccount {
  address: string
  chainId: number
}

// Singleton instance of appKit
let appKitInstance: AppKit | null = null

export function useWalletConnect() {
  const walletStore = useWalletStore()
  const isConnecting = ref(false)
  const isConnected = ref(false)
  const account = ref<WalletConnectAccount | null>(null)
  const error = ref<string | null>(null)

  // Helper function to update both local state and wallet store
  const updateConnectionState = (accountData: WalletConnectAccount) => {
    account.value = accountData
    isConnected.value = true
    
    // Update wallet store
    walletStore.setWalletState({
      address: accountData.address,
      chainId: accountData.chainId,
      connectionType: 'walletconnect'
    })
    
    console.log('Updated connection state:', accountData)
  }

  // Helper function to clear connection state
  const clearConnectionState = () => {
    account.value = null
    isConnected.value = false
    
    // Clear wallet store if it was WalletConnect connection
    if (walletStore.connectionType === 'walletconnect') {
      walletStore.clearWalletState()
    }
    
    console.log('Cleared connection state')
  }

  const initializeWalletConnect = async () => {
    if (appKitInstance) {
      // Check if already connected via wagmi
      const adapter = getWagmiAdapter()
      if (adapter && adapter.wagmiConfig) {
        const wagmiState = adapter.wagmiConfig.state
        if (wagmiState?.current && wagmiState.connections?.size) {
          const activeConnection = wagmiState.connections.get(wagmiState.current)
          if (activeConnection?.accounts && activeConnection.accounts.length > 0) {
            updateConnectionState({
              address: activeConnection.accounts[0],
              chainId: activeConnection.chainId || 1
            })
          }
        }
      }
      return
    }
    
    try {
      error.value = null
      appKitInstance = await createWalletConnectModal()
      
      // Setup event listeners for account state
      appKitInstance!.subscribeState((state: PublicStateControllerState) => {
        console.log('=== WalletConnect State Update ===')
        console.log('Full state object:', JSON.stringify(state, null, 2))
        console.log('State type:', typeof state)
        console.log('State properties:', state ? Object.keys(state) : 'null')
        
        // Check for connection state
        console.log('state.open:', state.open)
        console.log('state.selectedNetworkId:', state.selectedNetworkId)
        console.log('state.loading:', state.loading)
        console.log('state.activeChain:', state.activeChain)
        console.log('state.initialized:', state.initialized)
        
        // When modal is closed, check if we have an active connection
        if (!state.open && isConnected.value) {
          // Check if we still have an active connection via wagmi
          const adapter = getWagmiAdapter()
          if (adapter && adapter.wagmiConfig) {
            const wagmiState = adapter.wagmiConfig.state
            if (!wagmiState?.current || !wagmiState.connections?.size) {
              console.log('Modal closed and no active connection - disconnecting')
              clearConnectionState()
            }
          }
        }
      })
      
      // Also subscribe to wagmi adapter changes
      const adapter = getWagmiAdapter()
      if (adapter && adapter.wagmiConfig) {
        // Subscribe to wagmi state changes
        const unsubscribe = adapter.wagmiConfig.subscribe(
          (state) => state,
          (wagmiState: WagmiState) => {
          console.log('Wagmi subscription update:', wagmiState)
          
          if (wagmiState?.current && wagmiState.connections) {
            const activeConnection = wagmiState.connections.get(wagmiState.current)
            if (activeConnection?.accounts && activeConnection.accounts.length > 0) {
              console.log('Found account in wagmi subscription:', activeConnection.accounts[0])
              updateConnectionState({
                address: activeConnection.accounts[0],
                chainId: activeConnection.chainId || 1
              })
            }
          } else {
            // No active connection
            if (isConnected.value) {
              console.log('Lost connection in wagmi subscription')
              clearConnectionState()
            }
          }
        }
        )
        
        // Store unsubscribe function for cleanup
        onUnmounted(() => {
          unsubscribe()
        })
      }
      
      // Check initial state
      const initialState = appKitInstance!.getState()
      console.log('Initial state from getState():', initialState)
      console.log('State type:', typeof initialState)
      console.log('State keys:', initialState ? Object.keys(initialState) : 'null')
      
      // Log all available methods on appKitInstance
      console.log('AppKit instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(appKitInstance || {})))
      
      // Try to get the caipAddress or other connection info
      if (initialState) {
        console.log('Full initial state object:', JSON.stringify(initialState, null, 2))
      }
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to initialize WalletConnect'
      console.error('WalletConnect initialization error:', err)
    }
  }

  const connect = async () => {
    try {
      isConnecting.value = true
      error.value = null

      if (!appKitInstance) {
        await initializeWalletConnect()
      }

      // Open the modal - it will show QR for mobile, wallets for desktop
      await appKitInstance!.open()
      
      // Poll for connection state changes
      const checkConnection = setInterval(async () => {
        const state = appKitInstance!.getState()
        console.log('Polling AppKit state:', JSON.stringify(state, null, 2))
        
        // Get wagmi adapter to check actual connection
        const adapter = getWagmiAdapter()
        if (adapter && adapter.wagmiConfig) {
          // Get the current account from wagmi
          const wagmiState = adapter.wagmiConfig.state
          console.log('Wagmi state during polling:', wagmiState)
          
          if (wagmiState?.current && wagmiState.connections) {
            // Check if we have an active connection
            const activeConnection = wagmiState.connections.get(wagmiState.current)
            console.log('Active connection:', activeConnection)
            
            if (activeConnection?.accounts && activeConnection.accounts.length > 0) {
              const address = activeConnection.accounts[0]
              let chainId = activeConnection.chainId || 1
              
              console.log('Found connected account:', { address, chainId })
              
              // Force Base Sepolia in dev environment
              if (import.meta.env.DEV && chainId !== 84532) {
                console.log('Dev environment: Switching to Base Sepolia...')
                try {
                  await switchChain(84532)
                  chainId = 84532
                } catch (err) {
                  console.error('Failed to switch to Base Sepolia:', err)
                }
              }
              
              updateConnectionState({
                address: address,
                chainId: chainId
              })
              clearInterval(checkConnection)
              return
            }
          }
        }
        
        // Stop polling if modal is closed and no connection
        if (!state?.open) {
          console.log('Modal closed, stopping polling')
          clearInterval(checkConnection)
        }
      }, 500)
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to connect wallet'
      console.error('WalletConnect connection error:', err)
    } finally {
      isConnecting.value = false
    }
  }

  const disconnect = async () => {
    try {
      // Try to disconnect via wagmi adapter first
      const adapter = getWagmiAdapter()
      if (adapter && adapter.wagmiConfig) {
        const { disconnect: wagmiDisconnect } = await import('@wagmi/core')
        await wagmiDisconnect(adapter.wagmiConfig)
      }
      
      // Also disconnect via appKit
      if (appKitInstance) {
        await appKitInstance.disconnect()
      }
      
      clearConnectionState()
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to disconnect'
      console.error('WalletConnect disconnect error:', err)
    }
  }

  const getProvider = () => {
    if (!appKitInstance) return null
    return appKitInstance.getWalletProvider() as unknown
  }

  const sendTransaction = async (transaction: {
    to: string
    value?: string
    data?: string
  }) => {
    if (!account.value || !appKitInstance) {
      throw new Error('Wallet not connected')
    }

    try {
      const provider = getProvider() as { request: (args: { method: string; params: unknown[] }) => Promise<string> }
      if (!provider) throw new Error('No provider available')
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account.value.address,
          to: transaction.to,
          value: transaction.value || '0x0',
          data: transaction.data || '0x'
        }]
      })
      
      return txHash
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Transaction failed')
    }
  }

  const signMessage = async (message: string) => {
    if (!account.value || !appKitInstance) {
      throw new Error('Wallet not connected')
    }

    try {
      const provider = getProvider() as { request: (args: { method: string; params: unknown[] }) => Promise<string> }
      if (!provider) throw new Error('No provider available')
      
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account.value.address]
      })
      
      return signature
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Message signing failed')
    }
  }

  const switchChain = async (chainId: number) => {
    if (!appKitInstance) {
      throw new Error('Wallet not connected')
    }

    try {
      const provider = getProvider() as { request: (args: { method: string; params: unknown[] }) => Promise<void> }
      if (!provider) throw new Error('No provider available')
      
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
      
      if (account.value) {
        account.value.chainId = chainId
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Chain switch failed')
    }
  }


  const autoReconnect = async () => {
    try {
      console.log('Attempting auto-reconnect...')
      
      // Initialize WalletConnect if not already done
      if (!appKitInstance) {
        await initializeWalletConnect()
      }

      // Try to use Wagmi's reconnect functionality
      const adapter = getWagmiAdapter()
      if (adapter && adapter.wagmiConfig) {
        try {
          const { reconnect } = await import('@wagmi/core')
          const connections = await reconnect(adapter.wagmiConfig)
          
          if (connections && connections.length > 0) {
            const activeConnection = connections[0]
            if (activeConnection.accounts && activeConnection.accounts.length > 0) {
              console.log('Wagmi auto-reconnected successfully:', activeConnection)
              
              updateConnectionState({
                address: activeConnection.accounts[0],
                chainId: activeConnection.chainId || 1
              })
              
              console.log('Auto-reconnected successfully:', account.value)
              return true
            }
          }
        } catch (wagmiError) {
          console.log('Wagmi reconnect failed, trying manual check:', wagmiError)
          
          // Fallback to manual check if Wagmi reconnect fails
          const wagmiState = adapter.wagmiConfig.state
          if (wagmiState?.connections?.size) {
            for (const [connectorId, connection] of wagmiState.connections) {
              if (connection.accounts && connection.accounts.length > 0) {
                console.log('Found cached connection:', { connectorId, connection })
                
                // Set the current connection
                wagmiState.current = connectorId
                
                updateConnectionState({
                  address: connection.accounts[0],
                  chainId: connection.chainId || 1
                })
                
                console.log('Auto-reconnected successfully via fallback:', account.value)
                return true
              }
            }
          }
        }
      }
      
      console.log('No cached connection found')
      return false
    } catch (error) {
      console.error('Auto-reconnect failed:', error)
      return false
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    // AppKit handles its own cleanup
  })

  // Initialize on first use and attempt auto-reconnect
  initializeWalletConnect().then(() => {
    // After initialization, try auto-reconnect
    autoReconnect()
  })

  return {
    // State
    isConnecting,
    isConnected,
    account,
    error,
    
    // Actions
    connect,
    disconnect,
    sendTransaction,
    signMessage,
    switchChain,
    getProvider,
    autoReconnect,
    
    // Computed
    currentChain: () => {
      if (!account.value) return null
      const chainNames = {
        84532: { name: 'Base Sepolia', currency: 'ETH' },
        1: { name: 'Ethereum', currency: 'ETH' },
        11155111: { name: 'Sepolia', currency: 'ETH' }
      }
      return chainNames[account.value.chainId as keyof typeof chainNames] || null
    },
    
    // Debug helpers
    _debug: {
      appKitInstance: () => appKitInstance,
      getState: () => appKitInstance?.getState(),
      forceInit: () => initializeWalletConnect()
    }
  }
}