import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '../__mocks__/pharmacy-fetch.mock';
import '@testing-library/jest-dom';

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
    const favoritesButton = screen.getByRole('button', { name: /favoritos/i });
    expect(favoritesButton).toBeInTheDocument();
  });
});