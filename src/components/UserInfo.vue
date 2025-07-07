<template>
  <div v-if="walletStore.isConnected" class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Wallet Information</h2>
      <p class="text-sm text-gray-600">
        Connected via {{ walletStore.connectionType === 'web3auth' ? 'Web3Auth' : 'WalletConnect' }}
      </p>
    </div>
    
    <div class="space-y-4">
      <!-- Address Section -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Wallet Address</p>
            <p class="mt-1 text-lg font-mono text-gray-900">{{ formatAddress(walletStore.address || '') }}</p>
          </div>
          <button
            @click="copyAddress"
            class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>
      
      <!-- Balance Section -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Balance</p>
            <p class="mt-1 text-lg font-semibold text-gray-900">
              {{ formattedBalance }} {{ walletStore.currentNetwork?.currency || 'ETH' }}
            </p>
          </div>
          <button
            @click="refreshBalance"
            :disabled="isLoadingBalance"
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {{ isLoadingBalance ? 'Loading...' : 'Refresh' }}
          </button>
        </div>
      </div>
      
      <!-- Network Section -->
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500">Current Network</p>
        <div class="mt-1 flex items-center gap-2">
          <div 
            class="w-3 h-3 rounded-full"
            :class="walletStore.chainId === 1 ? 'bg-green-500' : 'bg-yellow-500'"
          ></div>
          <p class="text-lg font-semibold text-gray-900">
            {{ walletStore.currentNetwork?.name || 'Unknown Network' }}
          </p>
        </div>
      </div>
      
      <!-- Web3Auth User Info (if available) -->
      <div v-if="walletStore.connectionType === 'web3auth' && web3authUser && typeof web3authUser === 'object'" class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500 mb-2">User Profile</p>
        <div class="space-y-2">
          <div v-if="(web3authUser as any).name" class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Name:</span>
            <span class="text-sm font-medium text-gray-900">{{ (web3authUser as any).name }}</span>
          </div>
          <div v-if="(web3authUser as any).email" class="flex items-center gap-2">
            <span class="text-sm text-gray-600">Email:</span>
            <span class="text-sm font-medium text-gray-900">{{ (web3authUser as any).email }}</span>
          </div>
          <div v-if="(web3authUser as any).profileImage" class="flex items-center gap-2">
            <img 
              :src="(web3authUser as any).profileImage" 
              alt="Profile" 
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="mt-6 flex gap-3">
      <button
        @click="handleDisconnect"
        class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
      >
        Disconnect
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { useWeb3AuthUser, useWeb3AuthDisconnect } from '@web3auth/modal/vue'
import { useWalletConnect } from '@/composables/useWalletConnect'
import { formatEther } from 'viem'

const walletStore = useWalletStore()
const web3authUser = useWeb3AuthUser()
const { disconnect: web3authDisconnect } = useWeb3AuthDisconnect()
const { disconnect: walletConnectDisconnect } = useWalletConnect()

const copied = ref(false)
const isLoadingBalance = ref(false)

const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formattedBalance = computed(() => {
  if (!walletStore.balance) return '0.0000'
  try {
    const balance = formatEther(BigInt(walletStore.balance))
    return parseFloat(balance).toFixed(4)
  } catch {
    return '0.0000'
  }
})

const copyAddress = async () => {
  if (!walletStore.address) return
  
  try {
    await navigator.clipboard.writeText(walletStore.address)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy address:', err)
  }
}

const fetchBalance = async () => {
  if (!walletStore.address) return
  
  isLoadingBalance.value = true
  try {
    // Use a simple fetch to get balance from public RPC
    let rpcUrl = 'https://eth.llamarpc.com'
    switch (walletStore.chainId) {
      case 84532:
        rpcUrl = 'https://sepolia.base.org'
        break
      case 1:
        rpcUrl = 'https://eth.llamarpc.com'
        break
      case 11155111:
        rpcUrl = 'https://rpc.sepolia.org'
        break
    }
    
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [walletStore.address, 'latest'],
        id: 1
      })
    })
    
    const data = await response.json()
    if (data.result) {
      walletStore.setWalletState({ balance: data.result })
    }
  } catch (err) {
    console.error('Failed to fetch balance:', err)
  } finally {
    isLoadingBalance.value = false
  }
}

const refreshBalance = () => {
  fetchBalance()
}

const handleDisconnect = async () => {
  try {
    if (walletStore.connectionType === 'web3auth') {
      await web3authDisconnect()
    } else if (walletStore.connectionType === 'walletconnect') {
      await walletConnectDisconnect()
    }
    
    walletStore.clearWalletState()
  } catch (err) {
    console.error('Failed to disconnect:', err)
  }
}

// Fetch balance when component mounts or address changes
onMounted(() => {
  fetchBalance()
})

watch(() => walletStore.address, () => {
  if (walletStore.address) {
    fetchBalance()
  }
})
</script>