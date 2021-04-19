import { render, screen } from '@testing-library/react';
import App from './App';

/*
* Test case for the App Component
*/
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
