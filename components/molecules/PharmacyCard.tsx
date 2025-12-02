import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton } from '../atoms';
import { Pharmacy } from '../../types/pharmacy';

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  isFavorite?: boolean;
  onFavoriteToggle?: (cnpj: string) => void;
}

/**
 * PharmacyCard molecule - Cartão de exibição de farmácia
 * Exibe informações da farmácia com botão de favorito
 */
const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  isFavorite = false,
  onFavoriteToggle,
}) => {
  const handleFavoriteClick = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(pharmacy.cnpj);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
        '&:active': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1,
        p: { xs: 1.5, sm: 2 }, // Responsive padding
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom 
          color="primary"
          sx={{ 
            fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }, // Responsive font size
            lineHeight: 1.3,
          }}
        >
          {pharmacy.name}
        </Typography>
        
        <Box sx={{ mt: { xs: 1, sm: 2 } }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }} // Responsive font
          >
            <strong>Endereço:</strong> {pharmacy.address}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            gutterBottom
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            <strong>Bairro:</strong> {pharmacy.neighborhood}
          </Typography>
          
          {pharmacy.city && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              <strong>Cidade:</strong> {pharmacy.city}
            </Typography>
          )}
          
          {pharmacy.state && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              <strong>Estado:</strong> {pharmacy.state}
            </Typography>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ 
        justifyContent: 'flex-end', 
        px: { xs: 1.5, sm: 2 }, // Responsive padding
        pb: { xs: 1.5, sm: 2 },
      }}>
        <IconButton
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={handleFavoriteClick}
          color={isFavorite ? 'secondary' : 'default'}
          size="medium"
          sx={{
            minWidth: { xs: '44px', sm: '48px' }, // Minimum touch target size (WCAG)
            minHeight: { xs: '44px', sm: '48px' },
            '& .MuiSvgIcon-root': {
              fontSize: { xs: '1.25rem', sm: '1.5rem' }, // Responsive icon size
            },
            '&:active': {
              transform: 'scale(0.95)', // Touch feedback
            },
            transition: 'transform 0.1s ease-in-out',
          }}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PharmacyCard;
