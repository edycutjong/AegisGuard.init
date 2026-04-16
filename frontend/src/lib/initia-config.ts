

export const initiaConfig = {
  projectId: process.env.NEXT_PUBLIC_INTERWOVENKIT_PROJECT_ID || 'PLACEHOLDER_WALLETCONNECT_ID',
  chains: [
    {
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID || 'aegisguard-1',
      rpcUrl: process.env.NEXT_PUBLIC_L2_RPC || 'http://localhost:26657',
      chainName: 'AegisGuard',
    },
  ],
  features: {
    autoSigning: true,
    usernames: true,
  },
};
