import React from 'react';

export const useAddress = () => "0x123";
export const useWallet = () => ({});
export const useConnect = () => ({});
export const useDisconnect = () => ({});

// For Wagmi / Viem mocks
export const createConfig = () => ({});
export const http = () => ({});
export const mainnet = { id: 1 };
export const WagmiProvider = ({ children }: { children: React.ReactNode }) => children;

// For Initia InterwovenKit mock
export const InterwovenKitProvider = ({ children }: { children: React.ReactNode }) => children;

const dummy = {};
export default dummy;
