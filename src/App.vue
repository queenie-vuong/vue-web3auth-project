<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Web3AuthProvider } from '@web3auth/modal/vue'
import { WagmiProvider } from '@web3auth/modal/vue/wagmi'
import { web3AuthContextConfig } from './web3authContext'
import { config } from './wagmiConfig'
import AuthComponent from './components/AuthComponent.vue'
import WalletConnectComponent from './components/WalletConnectComponent.vue'
import UserInfo from './components/UserInfo.vue'
import CookieSettings from './components/CookieSettings.vue'
import { useWalletStore } from './stores/wallet'
// Import test script for debugging
import './test-walletconnect'

const walletStore = useWalletStore()
</script>

<template>
  <Web3AuthProvider :config="web3AuthContextConfig">
    <WagmiProvider :wagmi-config="config">
      <div class="min-h-screen bg-gray-100 flex flex-col">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <img alt="Vue logo" class="h-8 w-8" src="@/assets/logo.svg" />
                <span class="ml-2 text-xl font-bold text-gray-900">Vue Web3Auth</span>
              </div>
              
              <nav class="flex space-x-8">
                <RouterLink 
                  to="/" 
                  class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </RouterLink>
                <RouterLink 
                  to="/about" 
                  class="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </RouterLink>
              </nav>
            </div>
          </div>
        </header>

        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="px-4 py-6 sm:px-0">
            <!-- Show UserInfo when connected -->
            <div v-if="walletStore.isConnected" class="mb-8">
              <UserInfo />
            </div>
            
            <!-- Show connection options when not connected -->
            <div v-else class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
                Choose Your Connection Method
              </h1>
              
              <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <!-- Web3Auth Section -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Web3Auth (Social Login)
                  </h2>
                  <AuthComponent />
                </div>
                
                <!-- WalletConnect Section -->
                <div>
                  <h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">
                    WalletConnect (Direct Wallet)
                  </h2>
                  <WalletConnectComponent />
                </div>
              </div>
            </div>
            
            <RouterView />
          </div>
        </main>
        
        <footer class="bg-white border-t border-gray-200 mt-auto">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex justify-between items-center">
              <p class="text-sm text-gray-500">&copy; 2024 Vue Web3Auth. All rights reserved.</p>
              <CookieSettings />
            </div>
          </div>
        </footer>
      </div>
    </WagmiProvider>
  </Web3AuthProvider>
</template>

<style scoped>
nav a.router-link-exact-active {
  color: #2563eb;
  background-color: #eff6ff;
}
</style>
