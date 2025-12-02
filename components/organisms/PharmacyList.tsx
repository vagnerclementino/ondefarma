import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import { PharmacyCard } from '../molecules';
import { Pharmacy } from '../../types/pharmacy';

export interface PharmacyListProps {
  pharmacies: Pharmacy[];
  isLoading?: boolean;
  favoritePharmacies?: string[]; // Array de CNPJs favoritos
  onFavoriteToggle?: (cnpj: string) => void;
}

/**
 * PharmacyList organism - Lista de farmácias
 * Renderiza grid de PharmacyCards com estados de loading e vazio
 */
const PharmacyList: React.FC<PharmacyListProps> = ({
  pharmacies,
  isLoading = false,
  favoritePharmacies = [],
  onFavoriteToggle,
}) => {
  // Estado de loading
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <Fade in timeout={300 + index * 100} key={item}>
            <Card>
              <CardContent>
                <Skeleton 
                  variant="text" 
                  width="80%" 
                  height={32}
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="100%" 
                  sx={{ mt: 2 }}
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="100%"
                  animation="wave"
                />
                <Skeleton 
                  variant="text" 
                  width="60%"
                  animation="wave"
                />
              </CardContent>
            </Card>
          </Fade>
        ))}
      </Box>
    );
  }

  // Estado vazio
  if (pharmacies.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: { xs: '250px', sm: '300px' }, // Responsive height
          textAlign: 'center',
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
        }}
      >
        <Typography 
          variant="h5" 
          color="text.secondary" 
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} // Responsive font
        >
          Nenhuma farmácia encontrada
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} // Responsive font
        >
          Tente ajustar os filtros para encontrar farmácias na sua região.
        </Typography>
      </Box>
    );
  }

  // Lista de farmácias
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: { xs: 2, sm: 2.5, md: 3 },
      }}
    >
      {pharmacies.map((pharmacy, index) => (
        <Grow 
          in 
          timeout={300 + (index % 12) * 50} // Stagger animation for first 12 items
          style={{ transformOrigin: '0 0 0' }}
          key={pharmacy.cnpj}
        >
          <div>
            <PharmacyCard
              pharmacy={pharmacy}
              isFavorite={favoritePharmacies.includes(pharmacy.cnpj)}
              onFavoriteToggle={onFavoriteToggle}
            />
          </div>
        </Grow>
      ))}
    </Box>
  );
};

export default PharmacyList;
