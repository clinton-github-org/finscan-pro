import { render } from '@testing-library/react';
import App from '../App';

test('renders without crashing', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Hello, World/i);
  expect(linkElement).toBe(true);
//   expect(linkElement).toBeInTheDocument();
});
