import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound Page', () => {
  it('renders 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('System Fault: Module Offline')).toBeInTheDocument();
  });
});
