import React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { Select } from '@/components/atoms';

export interface FilterPanelProps {
  selectedState: string;
  states: string[];
  onStateChange: (state: string) => void;
  
  selectedCity: string;
  cities: string[];
  onCityChange: (city: string) => void;
  
  selectedNeighborhood: string;
  neighborhoods: string[];
  onNeighborhoodChange: (neighborhood: string) => void;
  
  loadingCities?: boolean;
  loadingNeighborhoods?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedState,
  states,
  onStateChange,
  selectedCity,
  cities,
  onCityChange,
  selectedNeighborhood,
  neighborhoods,
  onNeighborhoodChange,
  loadingCities = false,
  loadingNeighborhoods = false,
}) => {
  return (
    <Box
      sx={{
        mb: { xs: 2, sm: 3 },
        p: { xs: 1.5, sm: 2, md: 2.5 },
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        transition: 'box-shadow 0.3s ease-in-out',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: { xs: 1.5, sm: 2 },
        }}
      >
        <FormControl fullWidth size="small">
          <InputLabel id="state-select-label">Estado</InputLabel>
          <Select
            labelId="state-select-label"
            id="state-select"
            data-testid="state-select"
            value={selectedState}
            label="Estado"
            onChange={(e) => onStateChange(e.target.value as string)}
          >
            <MenuItem value="">
              <em>Todos os estados</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          fullWidth 
          size="small" 
          disabled={!selectedState || loadingCities}
          sx={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: !selectedState || loadingCities ? 0.6 : 1,
          }}
        >
          <InputLabel id="city-select-label">Cidade</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            data-testid="city-select"
            value={selectedCity}
            label="Cidade"
            onChange={(e) => onCityChange(e.target.value as string)}
          >
            <MenuItem value="">
              <em>{loadingCities ? 'Carregando...' : 'Todas as cidades'}</em>
            </MenuItem>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ position: 'relative' }}>
          <FormControl 
            fullWidth 
            size="small" 
            disabled={!selectedCity || loadingNeighborhoods}
            sx={{
              transition: 'opacity 0.3s ease-in-out',
              opacity: !selectedCity || loadingNeighborhoods ? 0.6 : 1,
            }}
          >
            <InputLabel id="neighborhood-select-label">Bairro</InputLabel>
            <Select
              labelId="neighborhood-select-label"
              id="neighborhood-select"
              data-testid="neighborhood-select"
              value={selectedNeighborhood}
              label="Bairro"
              onChange={(e) => onNeighborhoodChange(e.target.value as string)}
            >
              <MenuItem value="">
                <em>{loadingNeighborhoods ? 'Carregando...' : 'Todos os bairros'}</em>
              </MenuItem>
              {neighborhoods.map((neighborhood) => (
                <MenuItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedNeighborhood && (
            <IconButton
              data-testid="clear-neighborhood"
              size="small"
              onClick={() => onNeighborhoodChange('')}
              sx={{
                position: 'absolute',
                right: 32,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
      </Box>
  );
};

export default FilterPanel;
