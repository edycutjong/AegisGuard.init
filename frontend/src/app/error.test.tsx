import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './error';

describe('Error Page', () => {
  it('renders the error message and attempts to recover', () => {
    const error = new Error('Test Error') as Error & { digest?: string };
    const reset = jest.fn();

    render(<ErrorPage error={error} reset={reset} />);
    
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Try again" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: "Try again" }));
    expect(reset).toHaveBeenCalled();
  });
});
