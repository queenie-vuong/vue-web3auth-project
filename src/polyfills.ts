/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer } from 'buffer'

// Polyfill Buffer for browser environment
;(globalThis as any).Buffer = Buffer
;(window as any).Buffer = Buffer

// Polyfill process for browser environment
;(globalThis as any).process = {
  env: {},
  nextTick: (callback: () => void) => setTimeout(callback, 0)
}