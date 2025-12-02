import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '../__mocks__/pharmacy-fetch.mock';
import '@testing-library/jest-dom';

// Mock SWR hooks
jest.mock('../hooks/usePharmacies', () => ({
  usePharmacies: jest.fn(() => ({
    pharmacies: [
      {
        name: 'FARMACIA QUEIROZ CANEDO LTDA',
        cnpj: '12.345.678/0001-90',
        address: 'AVENIDA DONA BALDOINA, 36',
        neighborhood: 'CENTRO',
        city: 'BELO HORIZONTE',
        state: 'MG',
      },
    ],
    pagination: { page: 1, limit: 50, total: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    isLoading: false,
    error: null,
    mutate: jest.fn(),
  })),
  useStates: jest.fn(() => ({
    states: ['MG'],
    isLoading: false,
    error: null,
  })),
  useCities: jest.fn(() => ({
    cities: ['BELO HORIZONTE'],
    isLoading: false,
    error: null,
  })),
  useNeighborhoods: jest.fn(() => ({
    neighborhoods: ['CENTRO'],
    isLoading: false,
    error: null,
  })),
}));

// Mock data for testing
const mockPharmacies = [
  {
    name: 'FARMACIA QUEIROZ CANEDO LTDA',
    cnpj: '12.345.678/0001-90',
    address: 'AVENIDA DONA BALDOINA, 36',
    neighborhood: 'CENTRO',
    city: 'BELO HORIZONTE',
    state: 'MG',
  },
];

const mockProps = {
  initialPharmacies: mockPharmacies,
  initialStates: ['MG'],
  initialCities: ['BELO HORIZONTE'],
  initialNeighborhoods: ['CENTRO'],
};

describe('Home', () => {
  it('renders the application header', () => {
    render(<Home {...mockProps} />);
    const heading = screen.getByRole('heading', {
      name: /Ache uma Farmácia Popular/i,
    });
    expect(heading).toBeInTheDocument();
  });
  
  it('renders responsive filter panel with all filter options', () => {
    render(<Home {...mockProps} />);
    // Check for filter labels - these are part of the responsive design
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
  });
  
  it("renders the favorites button in header", () => {
    render(<Home {...mockProps} />);
    // Check that the responsive header includes the favorites button
    // Use getAllByRole since there are multiple buttons with "Favoritos" text
    const favoritesButtons = screen.getAllByRole('button', { name: /favoritos/i });
    // Should have at least one favorites button (in header)
    expect(favoritesButtons.length).toBeGreaterThan(0);
  });
});