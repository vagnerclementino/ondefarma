import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterPanel from '../components/molecules/FilterPanel';

describe('FilterPanel', () => {
  const mockStates = ['MG', 'SP', 'RJ'];
  const mockCities = ['BELO HORIZONTE', 'CONTAGEM', 'BETIM'];
  const mockNeighborhoods = ['CENTRO', 'SAVASSI', 'LOURDES'];

  const defaultProps = {
    selectedState: '',
    states: mockStates,
    onStateChange: jest.fn(),
    selectedCity: '',
    cities: mockCities,
    onCityChange: jest.fn(),
    selectedNeighborhood: '',
    neighborhoods: mockNeighborhoods,
    onNeighborhoodChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three filter selects', () => {
    render(<FilterPanel {...defaultProps} />);
    
    expect(screen.getByLabelText('Estado')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument();
  });

  it('displays all states in the state select', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const stateSelect = screen.getByLabelText('Estado');
    fireEvent.mouseDown(stateSelect);
    
    mockStates.forEach(state => {
      expect(screen.getByText(state)).toBeInTheDocument();
    });
  });

  it('calls onStateChange when a state is selected', async () => {
    render(<FilterPanel {...defaultProps} />);
    
    const stateSelect = screen.getByLabelText('Estado');
    fireEvent.mouseDown(stateSelect);
    
    const mgOption = screen.getByText('MG');
    fireEvent.click(mgOption);
    
    await waitFor(() => {
      expect(defaultProps.onStateChange).toHaveBeenCalledWith('MG');
    });
  });

  it('disables city select when no state is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="" />);
    
    const citySelect = screen.getByLabelText('Cidade');
    expect(citySelect).toHaveAttribute('aria-disabled', 'true');
  });

  it('enables city select when a state is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" />);
    
    const citySelect = screen.getByLabelText('Cidade');
    expect(citySelect).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onCityChange when a city is selected', async () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" />);
    
    const citySelect = screen.getByLabelText('Cidade');
    fireEvent.mouseDown(citySelect);
    
    const bhOption = screen.getByText('BELO HORIZONTE');
    fireEvent.click(bhOption);
    
    await waitFor(() => {
      expect(defaultProps.onCityChange).toHaveBeenCalledWith('BELO HORIZONTE');
    });
  });

  it('disables neighborhood select when no city is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="" />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(neighborhoodSelect).toHaveAttribute('aria-disabled', 'true');
  });

  it('enables neighborhood select when a city is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(neighborhoodSelect).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('calls onNeighborhoodChange when a neighborhood is selected', async () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    fireEvent.mouseDown(neighborhoodSelect);
    
    const centroOption = screen.getByText('CENTRO');
    fireEvent.click(centroOption);
    
    await waitFor(() => {
      expect(defaultProps.onNeighborhoodChange).toHaveBeenCalledWith('CENTRO');
    });
  });

  it('shows loading state for cities when loadingCities is true', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" loadingCities={true} />);
    
    const citySelect = screen.getByLabelText('Cidade');
    expect(citySelect).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows loading state for neighborhoods when loadingNeighborhoods is true', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" loadingNeighborhoods={true} />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(neighborhoodSelect).toHaveAttribute('aria-disabled', 'true');
  });

  it('implements cascading behavior: state -> city -> neighborhood', () => {
    const { rerender } = render(<FilterPanel {...defaultProps} />);
    
    // Initially, city and neighborhood should be disabled
    let citySelect = screen.getByLabelText('Cidade');
    let neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(citySelect).toHaveAttribute('aria-disabled', 'true');
    expect(neighborhoodSelect).toHaveAttribute('aria-disabled', 'true');
    
    // After selecting state, city should be enabled but neighborhood still disabled
    rerender(<FilterPanel {...defaultProps} selectedState="MG" />);
    citySelect = screen.getByLabelText('Cidade');
    neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(citySelect).not.toHaveAttribute('aria-disabled', 'true');
    expect(neighborhoodSelect).toHaveAttribute('aria-disabled', 'true');
    
    // After selecting city, neighborhood should be enabled
    rerender(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    neighborhoodSelect = screen.getByLabelText('Bairro');
    expect(neighborhoodSelect).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('displays "Todos os estados" option in state select', () => {
    render(<FilterPanel {...defaultProps} />);
    
    const stateSelect = screen.getByLabelText('Estado');
    fireEvent.mouseDown(stateSelect);
    
    expect(screen.getByText('Todos os estados')).toBeInTheDocument();
  });

  it('displays "Todas as cidades" option in city select', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" />);
    
    const citySelect = screen.getByLabelText('Cidade');
    fireEvent.mouseDown(citySelect);
    
    expect(screen.getByText('Todas as cidades')).toBeInTheDocument();
  });

  it('displays "Todos os bairros" option in neighborhood select', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    
    const neighborhoodSelect = screen.getByLabelText('Bairro');
    fireEvent.mouseDown(neighborhoodSelect);
    
    expect(screen.getByText('Todos os bairros')).toBeInTheDocument();
  });
});
