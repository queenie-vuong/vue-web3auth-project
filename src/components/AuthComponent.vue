<template>
  <!-- Hide when WalletConnect is active -->
  <div v-if="!walletStore.isWalletConnectConnected" class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Web3Auth Login</h1>
      <p class="text-gray-600 mt-2">Connect with Google</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">{{ loadingText }}</p>
    </div>

    <!-- Not connected state -->
    <div v-else-if="!isConnected" class="space-y-4">
      <button
        @click="handleConnect"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-3"
      >
        Sign in with Web3Auth
      </button>

      <div v-if="error" class="text-red-500 text-sm text-center">
        {{ error }}
      </div>

      <div class="text-center text-sm text-gray-500">
        Sign in with your Google account
      </div>
    </div>

    <!-- Connected state -->
    <div v-else class="space-y-4">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 class="font-semibold text-green-800 mb-2">Connected</h3>

        <div v-if="userInfo && Object.keys(userInfo).length > 0" class="space-y-2">
          <div class="flex items-center space-x-2">
            <img
              v-if="userInfo.profileImage"
              :src="userInfo.profileImage"
              alt="Profile"
              class="w-8 h-8 rounded-full"
            >
            <div>
              <p class="font-medium">{{ userInfo.name || 'Anonymous' }}</p>
              <p class="text-sm text-gray-600">{{ userInfo.email || 'No email' }}</p>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <p v-if="userInfo.verifier"><strong>Verifier:</strong> {{ userInfo.verifier }}</p>
            <p v-if="userInfo.verifierId"><strong>Verifier ID:</strong> {{ userInfo.verifierId }}</p>
          </div>
        </div>

        <div v-if="address" class="mt-4">
          <p class="text-sm font-medium text-gray-700">Account:</p>
          <p class="text-xs text-gray-600 bg-gray-100 p-2 rounded mt-1 break-all">
            {{ address }}
          </p>
        </div>

        <div v-if="connector" class="mt-2">
          <p class="text-sm text-gray-600">
            Connected via: <strong>{{ connector.name }}</strong>
          </p>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          @click="getUserInfo"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Get User Info
        </button>

        <button
          @click="handleDisconnect"
          :disabled="loading"
          class="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/vue'
import { useAccount } from '@wagmi/vue'
import { useWalletStore } from '@/stores/wallet'

// Define types
interface UserInfo {
  name?: string
  email?: string
  profileImage?: string
  verifier?: string
  verifierId?: string
  [key: string]: unknown
}

// State
const loading = ref(false)
const loadingText = ref('Loading...')
const error = ref('')
const userInfo = ref<UserInfo>({})

// Get account info from wagmi
const { address, isConnected, connector, chainId } = useAccount()

// Wallet store
const walletStore = useWalletStore()

// Web3Auth hooks
const { connect } = useWeb3AuthConnect()
const { disconnect } = useWeb3AuthDisconnect()
const web3authUser = useWeb3AuthUser()

// Watch for account changes and update wallet store
watch([address, chainId, isConnected], async ([newAddress, newChainId, newIsConnected]) => {
  if (newIsConnected && newAddress) {
    let finalChainId = newChainId || 1
    
    // Force Base Sepolia in dev environment
    if (import.meta.env.DEV && finalChainId !== 84532) {
      console.log('Dev environment: Switching Web3Auth to Base Sepolia...')
      try {
        // Get the Web3Auth provider and switch chain
        const web3authProvider = await connector.value?.getProvider?.()
        if (web3authProvider && typeof web3authProvider === 'object' && 'request' in web3authProvider) {
          await (web3authProvider as any).request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x14a34' }] // Base Sepolia
          })
          finalChainId = 84532
        }
      } catch (err) {
        console.error('Failed to switch Web3Auth to Base Sepolia:', err)
        // If switch fails, try to add the network
        try {
          const web3authProvider = await connector.value?.getProvider?.()
          if (web3authProvider && typeof web3authProvider === 'object' && 'request' in web3authProvider) {
            await (web3authProvider as any).request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x14a34',
                chainName: 'Base Sepolia',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia.basescan.org']
              }]
            })
            finalChainId = 84532
          }
        } catch (addErr) {
          console.error('Failed to add Base Sepolia to Web3Auth:', addErr)
        }
      }
    }
    
    walletStore.setWalletState({
      address: newAddress,
      chainId: finalChainId,
      connectionType: 'web3auth'
    })
  } else if (!newIsConnected && walletStore.connectionType === 'web3auth') {
    walletStore.clearWalletState()
  }
})

const handleConnect = async () => {
  try {
    loading.value = true
    loadingText.value = 'Connecting...'
    error.value = ''
    await connect()

    // Try to get user info after connection
    if (web3authUser && typeof web3authUser === 'object') {
      userInfo.value = { ...(web3authUser as unknown as UserInfo) }
    }
  } catch (err) {
    console.error('Connect error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to connect'
  } finally {
    loading.value = false
  }
}

const handleDisconnect = async () => {
  try {
    loading.value = true
    loadingText.value = 'Disconnecting...'
    await disconnect()
    userInfo.value = {}
  } catch (err) {
    console.error('Disconnect error:', err)
    error.value = err instanceof Error ? err.message : 'Failed to disconnect'
  } finally {
    loading.value = false
  }
}

const getUserInfo = () => {
  console.log('User info:', userInfo.value)
  console.log('Web3Auth user:', web3authUser)
  console.log('Address:', address.value)
  console.log('Connector:', connector.value)

  // Update user info if available
  if (web3authUser && typeof web3authUser === 'object') {
    userInfo.value = { ...(web3authUser as unknown as UserInfo) }
  }
}
</script>
