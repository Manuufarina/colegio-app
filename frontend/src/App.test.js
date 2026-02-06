import { render, screen } from '@testing-library/react';
import App from './App';

// Mock firebase to avoid real connections
jest.mock('./firebase', () => ({
  auth: null,
  db: null,
  storage: null,
  firebaseReady: false,
  default: null
}));

test('renders login page when not authenticated', async () => {
  render(<App />);
  const title = await screen.findByText('ColegioApp');
  expect(title).toBeInTheDocument();
});
