import { render } from '@testing-library/react';
import { Providers } from './Providers';
import { InterwovenKitProvider } from "@initia/interwovenkit-react";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";

describe('Providers', () => {
  it('renders children correctly', () => {
    console.log('InterwovenKitProvider:', typeof InterwovenKitProvider);
    console.log('WagmiProvider:', typeof WagmiProvider);
    console.log('QueryClientProvider:', typeof QueryClientProvider);
    const { getByText } = render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
