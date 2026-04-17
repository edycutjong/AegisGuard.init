import { initiaConfig } from './initia-config';

describe('initia-config', () => {
  it('should export an interwovenkit configuration object', () => {
    expect(initiaConfig).toHaveProperty('projectId');
    expect(initiaConfig).toHaveProperty('chains');
    expect(initiaConfig.chains.length).toBeGreaterThan(0);
    expect(initiaConfig.chains[0]).toHaveProperty('chainId');
    expect(initiaConfig.chains[0]).toHaveProperty('rpcUrl');
    expect(initiaConfig).toHaveProperty('features');
  });
});
