import { render, screen } from '@testing-library/react';
import { Home } from '../Home';
import { vi } from 'vitest';

test('renders the home page title', () => {
  render(<Home setLoading={vi.fn()} />);
  const titleElement = screen.getByText(/a change data capture pipeline for microservices/i);
  expect(titleElement).toBeInTheDocument();
});
