// Test script to debug WalletConnect state synchronization
import { createWalletConnectModal } from './config/walletConnect'
import type { PublicStateControllerState } from '@reown/appkit-controllers'

export async function testWalletConnectConnection() {
  console.log('Testing WalletConnect connection...')
  
  try {
    const appKit = await createWalletConnectModal()
    console.log('AppKit instance created:', appKit)
    
    // Check if appKit has the expected methods
    console.log('AppKit methods:', {
      hasSubscribeState: typeof appKit.subscribeState === 'function',
      hasGetState: typeof appKit.getState === 'function',
      hasOpen: typeof appKit.open === 'function',
      hasDisconnect: typeof appKit.disconnect === 'function'
    })
    
    // Get initial state
    const initialState = appKit.getState()
    console.log('Initial state:', initialState)
    
    // Subscribe to state changes
    appKit.subscribeState((state: PublicStateControllerState) => {
      console.log('State change detected in test:', state)
    })
    
    return appKit
  } catch (error) {
    console.error('Error in test:', error)
    throw error
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as { testWalletConnect?: typeof testWalletConnectConnection }).testWalletConnect = testWalletConnectConnection
}