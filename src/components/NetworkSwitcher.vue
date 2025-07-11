<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span>{{ currentNetwork?.displayName || 'Select Network' }}</span>
      <svg
        class="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      @click.stop
      class="absolute right-0 z-50 w-64 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div class="py-1">
        <button
          v-for="network in availableNetworks"
          :key="network.chainId"
          @click="handleNetworkSwitch(network)"
          :disabled="isSwitching || network.chainId === currentNetwork?.chainId"
          class="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'bg-indigo-50': network.chainId === currentNetwork?.chainId
          }"
        >
          <div class="flex-1">
            <div class="font-medium">{{ network.displayName }}</div>
            <div class="text-xs text-gray-500">{{ network.ticker }}</div>
          </div>
          <svg
            v-if="network.chainId === currentNetwork?.chainId"
            class="w-4 h-4 text-indigo-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <div
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWalletStore } from '@/stores/wallet'
import { SUPPORTED_NETWORKS, type NetworkConfig } from '@/config/networks'
import { switchNetwork } from '@/utils/networkSwitch'
import { useAccount } from '@wagmi/vue'
import { useWalletConnect } from '@/composables/useWalletConnect'

const walletStore = useWalletStore()
const { connector: web3AuthConnector } = useAccount()
const { connector: walletConnectConnector } = useWalletConnect()

const isOpen = ref(false)
const isSwitching = ref(false)

const currentNetwork = computed(() => walletStore.currentNetwork)

const availableNetworks = computed(() => {
  // In production, show all networks
  // In development, you might want to filter based on environment
  return Object.values(SUPPORTED_NETWORKS)
})

async function handleNetworkSwitch(network: NetworkConfig) {
  if (network.chainId === currentNetwork.value?.chainId) {
    isOpen.value = false
    return
  }

  isSwitching.value = true
  try {
    // Determine which connector to use based on connection type
    const activeConnector = walletStore.isWeb3AuthConnected
      ? web3AuthConnector.value
      : walletStore.isWalletConnectConnected
        ? walletConnectConnector.value
        : null

    if (!activeConnector) {
      throw new Error('No active connector found')
    }

    await switchNetwork(activeConnector, network)

    // Update the wallet store with new chain ID
    walletStore.setWalletState({
      chainId: network.chainIdDecimal
    })

    isOpen.value = false
  } catch (error) {
    console.error('Failed to switch network:', error)
    alert(`Failed to switch network: ${error}`)
  } finally {
    isSwitching.value = false
  }
}
</script>
