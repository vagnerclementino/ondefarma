import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <section className="surface-card filter-panel mb-4 p-4 sm:p-5">
      <div className="form-grid">
        <div className="form-field">
          <Label htmlFor="state-select">Estado</Label>
          <Select value={selectedState || '__all'} onValueChange={(v) => onStateChange(v === '__all' ? '' : v)}>
            <SelectTrigger id="state-select" data-testid="state-select" aria-label="Estado">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">Todos os estados</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-field">
          <Label htmlFor="city-select">Cidade</Label>
          <Select
            value={selectedCity || '__all'}
            onValueChange={(v) => onCityChange(v === '__all' ? '' : v)}
            disabled={!selectedState || loadingCities}
          >
            <SelectTrigger id="city-select" data-testid="city-select" aria-label="Cidade">
              <SelectValue placeholder={loadingCities ? 'Carregando...' : 'Todas as cidades'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{loadingCities ? 'Carregando...' : 'Todas as cidades'}</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="form-field relative">
          <Label htmlFor="neighborhood-select">Bairro</Label>
          <Select
            value={selectedNeighborhood || '__all'}
            onValueChange={(v) => onNeighborhoodChange(v === '__all' ? '' : v)}
            disabled={!selectedCity || loadingNeighborhoods}
          >
            <SelectTrigger id="neighborhood-select" data-testid="neighborhood-select" aria-label="Bairro">
              <SelectValue placeholder={loadingNeighborhoods ? 'Carregando...' : 'Todos os bairros'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">{loadingNeighborhoods ? 'Carregando...' : 'Todos os bairros'}</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedNeighborhood && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              data-testid="clear-neighborhood"
              onClick={() => onNeighborhoodChange('')}
              className="absolute right-1 top-7 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
