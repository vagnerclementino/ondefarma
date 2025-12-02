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
  it('renders a heading', () => {
    render(<Home {...mockProps} />);
    const heading = screen.getByRole('heading', {
      name: /Ache uma Farmácia Popular/i,
    });
    expect(heading).toBeInTheDocument();
  });
  
  it('renders filter panel with all filter options', () => {
    render(<Home {...mockProps} />);
    // Check for filter labels
    expect(screen.getByLabelText(/Estado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
  });
  
  it("renders initial pharmacy data", () => {
    render(<Home {...mockProps} />);

    // Check that the component renders with initial data
    // The component shows pharmacy cards with the initial data
    expect(screen.getByText("FARMACIA QUEIROZ CANEDO LTDA")).toBeInTheDocument();
  });
});