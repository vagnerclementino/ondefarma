import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterPanel from '@/components/molecules/FilterPanel';

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

    expect(screen.getByRole('combobox', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Bairro' })).toBeInTheDocument();
  });

  it('displays all states in the state select', () => {
    render(<FilterPanel {...defaultProps} />);

    fireEvent.click(screen.getByRole('combobox', { name: 'Estado' }));
    mockStates.forEach(state => {
      expect(screen.getByText(state)).toBeInTheDocument();
    });
  });

  it('calls onStateChange when a state is selected', async () => {
    render(<FilterPanel {...defaultProps} />);

    fireEvent.click(screen.getByRole('combobox', { name: 'Estado' }));
    fireEvent.click(screen.getByText('MG'));

    await waitFor(() => {
      expect(defaultProps.onStateChange).toHaveBeenCalledWith('MG');
    });
  });

  it('disables city select when no state is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="" />);
    expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeDisabled();
  });

  it('enables city select when a state is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" />);
    expect(screen.getByRole('combobox', { name: 'Cidade' })).not.toBeDisabled();
  });

  it('calls onCityChange when a city is selected', async () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" />);

    fireEvent.click(screen.getByRole('combobox', { name: 'Cidade' }));
    fireEvent.click(screen.getByText('BELO HORIZONTE'));

    await waitFor(() => {
      expect(defaultProps.onCityChange).toHaveBeenCalledWith('BELO HORIZONTE');
    });
  });

  it('disables neighborhood select when no city is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="" />);
    expect(screen.getByRole('combobox', { name: 'Bairro' })).toBeDisabled();
  });

  it('enables neighborhood select when a city is selected', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    expect(screen.getByRole('combobox', { name: 'Bairro' })).not.toBeDisabled();
  });

  it('calls onNeighborhoodChange when a neighborhood is selected', async () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);

    fireEvent.click(screen.getByRole('combobox', { name: 'Bairro' }));
    fireEvent.click(screen.getByText('CENTRO'));

    await waitFor(() => {
      expect(defaultProps.onNeighborhoodChange).toHaveBeenCalledWith('CENTRO');
    });
  });

  it('shows loading state for cities when loadingCities is true', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" loadingCities={true} />);
    expect(screen.getByRole('combobox', { name: 'Cidade' })).toBeDisabled();
  });

  it('shows loading state for neighborhoods when loadingNeighborhoods is true', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" loadingNeighborhoods={true} />);
    expect(screen.getByRole('combobox', { name: 'Bairro' })).toBeDisabled();
  });

  it('implements cascading behavior: state -> city -> neighborhood', () => {
    const { rerender } = render(<FilterPanel {...defaultProps} />);

    let citySelect = screen.getByRole('combobox', { name: 'Cidade' });
    let neighborhoodSelect = screen.getByRole('combobox', { name: 'Bairro' });
    expect(citySelect).toBeDisabled();
    expect(neighborhoodSelect).toBeDisabled();

    rerender(<FilterPanel {...defaultProps} selectedState="MG" />);
    citySelect = screen.getByRole('combobox', { name: 'Cidade' });
    neighborhoodSelect = screen.getByRole('combobox', { name: 'Bairro' });
    expect(citySelect).not.toBeDisabled();
    expect(neighborhoodSelect).toBeDisabled();

    rerender(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);
    neighborhoodSelect = screen.getByRole('combobox', { name: 'Bairro' });
    expect(neighborhoodSelect).not.toBeDisabled();
  });

  it('displays default options in each select', () => {
    render(<FilterPanel {...defaultProps} selectedState="MG" selectedCity="BELO HORIZONTE" />);

    fireEvent.click(screen.getByRole('combobox', { name: 'Estado' }));
    expect(screen.getByText('Todos os estados')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'MG' }));

    fireEvent.click(screen.getByRole('combobox', { name: 'Cidade' }));
    expect(screen.getByText('Todas as cidades')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('option', { name: 'BELO HORIZONTE' }));

    fireEvent.click(screen.getByRole('combobox', { name: 'Bairro' }));
    expect(screen.getAllByText('Todos os bairros').length).toBeGreaterThan(0);
  });
});
