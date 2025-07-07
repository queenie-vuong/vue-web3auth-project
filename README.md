# Vue 3 Web3Auth Project

A Vue 3 application with Web3Auth integration for authentication via Google, Metamask, and WalletConnect.

## Features

- 🔐 **Web3Auth Integration**: Secure authentication with multiple providers
- 🌐 **Multiple Login Options**: Google, Metamask, WalletConnect, and more
- 🎨 **Tailwind CSS**: Modern UI styling
- 📱 **Responsive Design**: Works on all devices
- 🔧 **TypeScript**: Full type safety
- 🗄️ **Pinia**: State management
- 🔗 **Vue Router**: Client-side routing

## Prerequisites

- Node.js 18+ (Note: Current setup uses Node.js 20.15.0)
- npm or yarn
- Web3Auth Client ID (get from [Web3Auth Dashboard](https://dashboard.web3auth.io))

## Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   cd vue-web3auth-project
   npm install
   ```

2. **Configure Web3Auth**:
   - Visit [Web3Auth Dashboard](https://dashboard.web3auth.io)
   - Create a new project
   - Get your Client ID
   - Create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Add your Client ID to `.env`:
     ```
     VITE_WEB3AUTH_CLIENT_ID=your-actual-client-id-here
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   └── AuthComponent.vue     # Main authentication component
├── stores/
│   └── auth.ts              # Pinia store for authentication
├── router/
│   └── index.ts             # Vue Router configuration
├── views/
│   ├── HomeView.vue
│   └── AboutView.vue
├── assets/
│   └── main.css            # Tailwind CSS imports
└── App.vue                 # Main app component
```

## Authentication Flow

1. **Initialization**: Web3Auth is initialized when the app starts
2. **Login**: Users can connect using various providers (Google, Metamask, etc.)
3. **User Info**: Display user profile and wallet information
4. **Logout**: Clean disconnect from Web3Auth

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Supported Authentication Methods

- **Social Logins**: Google, Facebook, Twitter, Discord, etc.
- **Wallet Connect**: WalletConnect v2
- **MetaMask**: Browser extension
- **Email/SMS**: Passwordless authentication
- **Custom Auth**: Your own authentication system

## Configuration

The Web3Auth configuration is located in `src/stores/auth.ts`. You can modify:

- **Network**: Currently set to Sapphire Devnet (must match your Web3Auth dashboard configuration)
  - Available networks: SAPPHIRE_DEVNET, SAPPHIRE_MAINNET, MAINNET, TESTNET, CYAN
- **Chain**: Currently set to Ethereum Mainnet
- **RPC Provider**: Currently using LlamaRPC (free public endpoint)
  - Alternative free RPC endpoints:
    - `https://cloudflare-eth.com`
    - `https://rpc.flashbots.net`
    - `https://1rpc.io/eth`
- **Additional Providers**: Add more authentication methods

## Environment Variables

- `VITE_WEB3AUTH_CLIENT_ID` - Your Web3Auth Client ID (required)

## Troubleshooting

1. **Node.js Version**: If you encounter engine warnings, consider upgrading to Node.js 22.12.0+
2. **Client ID**: Make sure you have a valid Web3Auth Client ID
3. **Network Issues**: Check if the RPC endpoint is accessible
4. **Browser Console**: Check for any JavaScript errors

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.
