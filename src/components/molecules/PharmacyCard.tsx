import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Pharmacy } from '@/types/pharmacy';

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isFavorite?: boolean;
  onFavoriteToggle?: (cnpj: string) => void;
}

const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  return (
    <Card data-testid="pharmacy-card" data-cnpj={pharmacy.cnpj} className="pharmacy-card">
      <CardHeader className="pb-2">
        <CardTitle className="pharmacy-card-title">{pharmacy.name}</CardTitle>
      </CardHeader>

      <CardContent className="pharmacy-card-body pt-0">
        <p className="pharmacy-card-meta"><strong>Endereço:</strong> {pharmacy.address}</p>
        <p className="pharmacy-card-meta"><strong>Bairro:</strong> {pharmacy.neighborhood}</p>
        {pharmacy.city && <p className="pharmacy-card-meta"><strong>Cidade:</strong> {pharmacy.city}</p>}
        {pharmacy.state && <p className="pharmacy-card-meta"><strong>Estado:</strong> {pharmacy.state}</p>}
      </CardContent>

      <CardFooter className="pharmacy-card-actions">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={() => onFavoriteToggle?.(pharmacy.cnpj)}
          className={isFavorite ? 'text-red-600 hover:text-red-700' : 'text-muted-foreground'}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PharmacyCard;
