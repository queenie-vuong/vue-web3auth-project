<template>
  <button
    @click="showCookieSettings"
    class="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
  >
    Cookie Settings
  </button>
</template>

<script setup lang="ts">
import { showCookieConsentModal } from '@/config/cookieConsent'

const showCookieSettings = () => {
  showCookieConsentModal()
}
</script>