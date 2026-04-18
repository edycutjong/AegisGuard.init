import { render } from '@testing-library/react';
import { Providers } from './Providers';

describe('Providers', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Providers>
        <div>Test Child</div>
      </Providers>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });
});
