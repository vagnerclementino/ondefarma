import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PharmacyCard } from '@/components/molecules';
import { Pharmacy } from '@/types/pharmacy';

export interface PharmacyListProps {
  pharmacies: Pharmacy[];
  isLoading?: boolean;
  favoritePharmacies?: string[];
  onFavoriteToggle?: (cnpj: string) => void;
}

const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  isLoading = false,
  favoritePharmacies = [],
  onFavoriteToggle,
}) => {
  const favoriteSet = useMemo(() => new Set(favoritePharmacies), [favoritePharmacies]);

  if (isLoading) {
    return (
      <div className="grid-cards">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-3 p-4">
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/5" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="surface-card p-8 text-center">
        <h2 className="text-xl font-semibold m-0 mb-2">Nenhuma farmácia encontrada</h2>
        <p className="helper-text">Tente ajustar os filtros para encontrar farmácias na sua região.</p>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {pharmacies.map((pharmacy) => (
        <PharmacyCard
          key={pharmacy.cnpj}
          pharmacy={pharmacy}
          isFavorite={favoriteSet.has(pharmacy.cnpj)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};

export default PharmacyList;
