import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Link from 'next/link';
import useSWR from 'swr';
import { Pharmacy } from '../types/pharmacy';
import { Header, Footer } from '../components/organisms';
import { PharmacyList } from '../components/organisms';
import { Button } from '../components/atoms';
import { useFavorites } from '../hooks/useFavorites';

// Dynamic import for ScrollToTop (not needed on initial render)
const ScrollToTop = dynamic(() => import('../components/atoms/ScrollToTop'), {
  ssr: false,
});

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao carregar dados');
  }
  return response.json();
};

export default function Favorites() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();
  
  // Use SWR to fetch all pharmacies with caching
  const { data: allPharmaciesData, error: fetchError, isLoading } = useSWR(
    '/api/pharmacies?limit=50',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  
  // Filter pharmacies by favorites
  const pharmacies = (allPharmaciesData?.data || []).filter((pharmacy: Pharmacy) => {
    const normalizedCnpj = pharmacy.cnpj?.trim();
    const normalizedFavorites = favorites.map(cnpj => cnpj.trim());
    return normalizedCnpj && normalizedFavorites.includes(normalizedCnpj);
  });
  
  const error = fetchError ? 'Erro ao carregar farmácias favoritas. Por favor, tente novamente.' : null;

  // Handle favorite toggle with feedback
  const handleFavoriteToggle = (cnpj: string) => {
    toggleFavorite(cnpj);
    setSnackbarMessage('Farmácia removida dos favoritos');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Fade in timeout={500}>
          <Box sx={{ 
            py: { xs: 2, sm: 3, md: 4 },
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              Minhas Farmácias Favoritas
            </Typography>

            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ mb: { xs: 2, sm: 3 } }}
                >
                  {error}
                </Alert>
              </Fade>
            )}
            
            {favoritesError && (
              <Fade in>
                <Alert severity="warning" sx={{ mb: { xs: 2, sm: 3 } }}>
                  {favoritesError}
                </Alert>
              </Fade>
            )}

            {!isLoading && pharmacies.length === 0 && (
              <Grow in timeout={600}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: '300px', sm: '400px' },
                    textAlign: 'center',
                    p: { xs: 2, sm: 3, md: 4 },
                  }}
                >
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                  >
                    Você ainda não tem farmácias favoritas
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    Adicione farmácias aos favoritos para acessá-las rapidamente aqui.
                  </Typography>
                  <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Buscar Farmácias
                    </Button>
                  </Link>
                </Box>
              </Grow>
            )}

            {(isLoading || pharmacies.length > 0) && (
              <PharmacyList
                pharmacies={pharmacies}
                isLoading={isLoading}
                favoritePharmacies={favorites}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
          </Box>
        </Fade>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}
