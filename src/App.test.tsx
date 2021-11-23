import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaceValueChart from './PlaceValueChart';

test('renders learn react link', () => {
  render(<PlaceValueChart />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
