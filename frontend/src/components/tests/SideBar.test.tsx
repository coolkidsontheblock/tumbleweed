import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../Sidebar';
import { sidebarData } from '../../utils/sidebarData';

test('renders all sidebar links correctly', () => {
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );

  sidebarData.forEach((item) => {
    const linkElement = screen.getByText(item.title);
    expect(linkElement).toBeInTheDocument();
  });

  const linkElements = screen.getAllByRole('link');
  expect(linkElements).toHaveLength(4);
});
