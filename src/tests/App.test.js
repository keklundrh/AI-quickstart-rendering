import App from '../App';
import { render, screen } from '@testing-library/react';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('root')).toBeInTheDocument();
  });

  it('shows loading state when data is being fetched', () => {
    const loadKickstartsSpy = jest.spyOn(App.prototype, 'loadKickstarts', 'async').mockImplementation(
      async () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    render(<App />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    loadKickstartsSpy.mockRestore();
  });

  it('displays kickstarts when data is loaded', async () => {
    render(<App />);
    await expect(screen.findAllByRole('article')).resolves.toHaveLength(1);
  });

  it('allows filtering kickstarts by category', () => {
    render(<App />);
    const categoryFilter = screen.getByLabelText('Filter by Category');
    expect(categoryFilter).toBeInTheDocument();
  });

  it('allows refreshing kickstarts manually', () => {
    render(<App />);
    const refreshButton = screen.getByRole('button', { name: 'Refresh' });
    expect(refreshButton).toBeInTheDocument();
  });
});