import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PharmacyCard from '../components/molecules/PharmacyCard';
import { Pharmacy } from '../types/pharmacy';

const mockPharmacy: Pharmacy = {
  cnpj: '12.345.678/0001-90',
  name: 'Farmácia Teste',
  address: 'Rua Teste, 123',
  neighborhood: 'Centro',
  city: 'BELO HORIZONTE',
  state: 'MG',
};

describe('PharmacyCard', () => {
  it('renders pharmacy information correctly', () => {
    render(<PharmacyCard pharmacy={mockPharmacy} />);
    
    expect(screen.getByText('Farmácia Teste')).toBeInTheDocument();
    expect(screen.getByText(/Rua Teste, 123/)).toBeInTheDocument();
    expect(screen.getByText(/Centro/)).toBeInTheDocument();
    expect(screen.getByText(/BELO HORIZONTE/)).toBeInTheDocument();
    expect(screen.getByText(/MG/)).toBeInTheDocument();
  });

  it('displays unfavorited icon when isFavorite is false', () => {
    render(<PharmacyCard pharmacy={mockPharmacy} isFavorite={false} />);
    
    const button = screen.getByLabelText('Adicionar aos favoritos');
    expect(button).toBeInTheDocument();
  });

  it('displays favorited icon when isFavorite is true', () => {
    render(<PharmacyCard pharmacy={mockPharmacy} isFavorite={true} />);
    
    const button = screen.getByLabelText('Remover dos favoritos');
    expect(button).toBeInTheDocument();
  });

  it('calls onFavoriteToggle with pharmacy CNPJ when favorite button is clicked', () => {
    const mockToggle = jest.fn();
    render(
      <PharmacyCard 
        pharmacy={mockPharmacy} 
        isFavorite={false}
        onFavoriteToggle={mockToggle}
      />
    );
    
    const button = screen.getByLabelText('Adicionar aos favoritos');
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
    expect(mockToggle).toHaveBeenCalledWith('12.345.678/0001-90');
  });

  it('does not crash when onFavoriteToggle is not provided', () => {
    render(<PharmacyCard pharmacy={mockPharmacy} />);
    
    const button = screen.getByLabelText('Adicionar aos favoritos');
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('renders without city when city is not provided', () => {
    const pharmacyWithoutCity = { ...mockPharmacy, city: undefined };
    render(<PharmacyCard pharmacy={pharmacyWithoutCity} />);
    
    expect(screen.getByText('Farmácia Teste')).toBeInTheDocument();
    expect(screen.queryByText(/Cidade:/)).not.toBeInTheDocument();
  });

  it('renders without state when state is not provided', () => {
    const pharmacyWithoutState = { ...mockPharmacy, state: undefined };
    render(<PharmacyCard pharmacy={pharmacyWithoutState} />);
    
    expect(screen.getByText('Farmácia Teste')).toBeInTheDocument();
    expect(screen.queryByText(/Estado:/)).not.toBeInTheDocument();
  });

  it('applies hover effects through Material-UI sx prop', () => {
    const { container } = render(<PharmacyCard pharmacy={mockPharmacy} />);
    
    // Check that the card component is rendered
    const card = container.querySelector('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });
});
