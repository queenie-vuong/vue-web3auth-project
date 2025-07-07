<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Web3AuthProvider } from '@web3auth/modal/vue'
import { WagmiProvider } from '@web3auth/modal/vue/wagmi'
import { web3AuthContextConfig } from './web3authContext'
import { config } from './wagmiConfig'
import AuthComponent from './components/AuthComponent.vue'
</script>

<template>
  <Web3AuthProvider :config="web3AuthContextConfig">
    <WagmiProvider :wagmi-config="config">
      <div class="min-h-screen bg-gray-100">
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
            <AuthComponent />
            <RouterView />
          </div>
        </main>
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
