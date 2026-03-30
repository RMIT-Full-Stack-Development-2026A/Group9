import { render, screen } from '@testing-library/react';
import PlayerRegis from './player-regis';

test('renders learn react link', () => {
  render(<PlayerRegis />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
