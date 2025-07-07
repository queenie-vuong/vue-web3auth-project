import { ref, onMounted } from 'vue'
import { getCookieConsentValue } from '@/config/cookieConsent'

export function useCookieConsent() {
  const analyticsEnabled = ref(false)
  const marketingEnabled = ref(false)
  const functionalityEnabled = ref(false)

  const updateConsentStatus = () => {
    analyticsEnabled.value = getCookieConsentValue('analytics')
    marketingEnabled.value = getCookieConsentValue('marketing')
    functionalityEnabled.value = getCookieConsentValue('functionality')
  }

  onMounted(() => {
    updateConsentStatus()
    
    // Listen for consent changes
    window.addEventListener('cc:onConsent', updateConsentStatus)
    window.addEventListener('cc:onChange', updateConsentStatus)
  })

  return {
    analyticsEnabled,
    marketingEnabled,
    functionalityEnabled,
    updateConsentStatus
  }
}