# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application with Web3Auth integration for blockchain authentication. The app provides multiple login options (Google, Metamask, WalletConnect) and displays user wallet information including balance and account details.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (includes type checking)
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking with vue-tsc
- `npm run lint` - Run ESLint with auto-fix

### Build Process
The build process runs type checking and building in parallel using `npm-run-all2`. The production build requires both type checking and building to succeed.

## Architecture

### Tech Stack
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **Authentication**: Web3Auth Modal SDK
- **Blockchain**: Ethereum via Web3Auth's Ethereum Provider
- **TypeScript**: Full type coverage

### Key Components

#### Authentication Flow
- **Entry Point**: `src/stores/auth.ts` - Pinia store managing Web3Auth instance
- **UI Component**: `src/components/AuthComponent.vue` - Main authentication interface
- **Network Config**: Uses Ethereum Mainnet with Ankr RPC endpoint
- **Environment**: Currently configured for TESTNET (change to MAINNET for production)

#### State Management
- **Auth Store** (`src/stores/auth.ts`): Handles Web3Auth initialization, login/logout, user info, and wallet operations
- **Counter Store** (`src/stores/counter.ts`): Template store (can be removed)

#### Application Structure
- **App.vue**: Main layout with header navigation and AuthComponent
- **Router**: Basic routing between Home and About views
- **Views**: Standard Vue Router views in `src/views/`

## Configuration

### Environment Variables
- `VITE_WEB3AUTH_CLIENT_ID` - Web3Auth Client ID (required)
  - Get from [Web3Auth Dashboard](https://dashboard.web3auth.io)
  - Must be set in `.env` file for local development

### Web3Auth Configuration
Located in `src/stores/auth.ts`:
- **Network**: TESTNET (line 47) - change to MAINNET for production
- **Chain**: Ethereum Mainnet (chainId: '0x1')
- **RPC**: Ankr endpoint (https://rpc.ankr.com/eth)
- **Client ID**: Read from environment variable

### TypeScript Configuration
- `tsconfig.json` - Root TypeScript config
- `tsconfig.app.json` - Application-specific config
- `tsconfig.node.json` - Node.js tooling config
- Uses `vue-tsc` for Vue + TypeScript compilation

## Development Notes

### Web3Auth Integration
- Initialization happens in `AuthComponent.vue` on mount
- Login flow connects to Web3Auth modal and retrieves user info
- Wallet operations (getAccounts, getBalance) use the provider directly
- Balance displayed in ETH (converted from wei)

### State Reactivity
- Uses Vue 3 Composition API throughout
- Pinia stores provide reactive state management
- Real-time updates for login state and wallet information

### Error Handling
- Authentication errors logged to console
- Loading states managed via Pinia store
- User feedback through UI states (loading, connected, error)

## Production Considerations

### Security
- Web3Auth Client ID should be environment-specific
- Never commit sensitive keys to repository
- Consider network configuration for production deployment

### Performance
- Vite provides efficient development and build tooling
- Tailwind CSS is purged in production builds
- Vue 3 offers better performance than Vue 2

### Deployment
- Build artifacts in `dist/` directory
- Requires Web3Auth Client ID configuration
- Environment variables must be set with `VITE_` prefix for client-side access