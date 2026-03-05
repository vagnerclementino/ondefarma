import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';
import '../__mocks__/pharmacy-fetch.mock';
import '@testing-library/jest-dom';

jest.mock('@/hooks/usePharmacies', () => ({
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
  initialSelectedState: 'MG',
  initialSelectedCity: 'BELO HORIZONTE',
  initialSelectedNeighborhood: '',
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
    expect(screen.getByRole('combobox', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Bairro' })).toBeInTheDocument();
  });

  it('renders the favorites navigation link in header', () => {
    render(<Home {...mockProps} />);
    const favoritesLink = screen.getByRole('link', { name: /favoritos/i });
    expect(favoritesLink).toBeInTheDocument();
  });
});
