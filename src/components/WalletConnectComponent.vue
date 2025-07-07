<template>
  <!-- Hide when Web3Auth is active -->
  <div v-if="!walletStore.isWeb3AuthConnected" class="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">WalletConnect</h2>
    
    <!-- Connection Status -->
    <div v-if="isConnected && account" class="mb-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Connected via WalletConnect</h3>
            <div class="mt-2 text-sm text-green-700">
              <p><strong>Address:</strong> {{ formatAddress(account.address) }}</p>
              <p><strong>Chain:</strong> {{ currentChain()?.name || `Chain ${account.chainId}` }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actions for connected state -->
      <div class="mt-4 space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="handleSignMessage"
            :disabled="isSigningMessage"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSigningMessage ? 'Signing...' : 'Sign Message' }}
          </button>
          
          <button
            @click="handleSendTransaction"
            :disabled="isSendingTransaction"
            class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSendingTransaction ? 'Sending...' : 'Send Test Tx' }}
          </button>
        </div>
        
        <button
          @click="disconnect"
          class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Disconnect WalletConnect
        </button>
      </div>
    </div>
    
    <!-- Connection Interface -->
    <div v-else class="space-y-4">
      <!-- Connect Button -->
      <button
        @click="connect"
        :disabled="isConnecting"
        class="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {{ isConnecting ? 'Opening Wallet Modal...' : 'Connect with WalletConnect' }}
      </button>
      
      <div class="text-sm text-gray-600 text-center">
        <p class="mb-2">Connect your wallet using WalletConnect.</p>
        <p><strong>Mobile:</strong> Scan QR code with your wallet app</p>
        <p><strong>Desktop:</strong> Select from available wallet extensions</p>
      </div>
    </div>
    
    <!-- Error Display -->
    <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <div class="mt-2 text-sm text-red-700">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Transaction Results -->
    <div v-if="lastTransactionHash" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-blue-800 mb-2">Last Transaction</h4>
      <div class="text-sm text-blue-700 break-all">
        Hash: {{ lastTransactionHash }}
      </div>
    </div>
    
    <div v-if="lastSignature" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 class="text-sm font-medium text-green-800 mb-2">Last Signature</h4>
      <div class="text-sm text-green-700 break-all">
        {{ lastSignature }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useWalletConnect } from '@/composables/useWalletConnect'
import { useWalletStore } from '@/stores/wallet'

const walletStore = useWalletStore()

const {
  isConnecting,
  isConnected,
  account,
  error,
  connect,
  disconnect,
  sendTransaction,
  signMessage,
  currentChain
} = useWalletConnect()

const isSigningMessage = ref(false)
const isSendingTransaction = ref(false)
const lastTransactionHash = ref('')
const lastSignature = ref('')

// Debug logging on mount
onMounted(() => {
  console.log('WalletConnectComponent mounted')
  console.log('Initial isConnected:', isConnected.value)
  console.log('Initial account:', account.value)
  console.log('Initial walletStore state:', {
    address: walletStore.address,
    connectionType: walletStore.connectionType,
    isConnected: walletStore.isConnected
  })
})

// Watch for account changes and update wallet store
watch(
  [account, isConnected], 
  ([newAccount, newIsConnected]) => {
    console.log('WalletConnectComponent watch triggered')
    console.log('newAccount:', newAccount)
    console.log('newIsConnected:', newIsConnected)
    console.log('Current walletStore state:', {
      address: walletStore.address,
      connectionType: walletStore.connectionType,
      isConnected: walletStore.isConnected
    })
    
    if (newIsConnected && newAccount) {
      console.log('Updating wallet store with WalletConnect data')
      walletStore.setWalletState({
        address: newAccount.address,
        chainId: newAccount.chainId,
        connectionType: 'walletconnect'
      })
      console.log('Wallet store after update:', {
        address: walletStore.address,
        connectionType: walletStore.connectionType,
        isConnected: walletStore.isConnected
      })
    } else if (!newIsConnected && walletStore.connectionType === 'walletconnect') {
      console.log('Clearing wallet store')
      walletStore.clearWalletState()
    }
  },
  { immediate: true }
)

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const handleSignMessage = async () => {
  if (!account.value) return
  
  try {
    isSigningMessage.value = true
    const message = `Hello from Vue Web3Auth Project!\n\nWallet: ${account.value.address}\nTimestamp: ${new Date().toISOString()}`
    const signature = await signMessage(message)
    lastSignature.value = signature as string
    console.log('Message signed:', signature)
  } catch (err) {
    console.error('Failed to sign message:', err)
  } finally {
    isSigningMessage.value = false
  }
}

const handleSendTransaction = async () => {
  if (!account.value) return
  
  try {
    isSendingTransaction.value = true
    // Send a small amount to self (test transaction)
    const txHash = await sendTransaction({
      to: account.value.address,
      value: '0x1' // 1 wei
    })
    lastTransactionHash.value = txHash as string
    console.log('Transaction sent:', txHash)
  } catch (err) {
    console.error('Failed to send transaction:', err)
  } finally {
    isSendingTransaction.value = false
  }
}
</script>