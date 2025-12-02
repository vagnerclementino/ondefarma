import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Link from 'next/link';
import { Pharmacy } from '../types/pharmacy';
import { Header, Footer } from '../components/organisms';
import { PharmacyList } from '../components/organisms';
import { Button, ScrollToTop } from '../components/atoms';
import { useFavorites } from '../hooks/useFavorites';

export default function Favorites() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();

  // Fetch pharmacy data for all favorite CNPJs
  useEffect(() => {
    const fetchFavoritePharmacies = async () => {
      if (favorites.length === 0) {
        setPharmacies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch all pharmacies - we'll fetch all pages to ensure we get all favorites
        const allPharmacies: Pharmacy[] = [];
        let currentPage = 1;
        let hasMorePages = true;
        
        while (hasMorePages) {
          const response = await fetch(`/api/pharmacies?limit=50&page=${currentPage}`);
          
          if (!response.ok) {
            throw new Error('Erro ao carregar farmácias favoritas');
          }
          
          const responseData = await response.json();
          const pagePharmacies = responseData.data || [];
          
          allPharmacies.push(...pagePharmacies);
          
          // Check if there are more pages
          hasMorePages = responseData.pagination?.hasNextPage || false;
          currentPage++;
          
          // Safety check to prevent infinite loops
          if (currentPage > 100) {
            break;
          }
        }
        
        // Filter pharmacies by favorite CNPJs
        // Normalize CNPJs by trimming whitespace for comparison
        const normalizedFavorites = favorites.map(cnpj => cnpj.trim());
        
        const favoritePharmacies = allPharmacies.filter((pharmacy: Pharmacy) => {
          const normalizedCnpj = pharmacy.cnpj?.trim();
          return normalizedCnpj && normalizedFavorites.includes(normalizedCnpj);
        });
        
        setPharmacies(favoritePharmacies);
      } catch (err) {
        console.error('Error fetching favorite pharmacies:', err);
        setError('Erro ao carregar farmácias favoritas. Por favor, tente novamente.');
        setPharmacies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritePharmacies();
  }, [favorites]);

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
          px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        }}
      >
        <Fade in timeout={500}>
          <Box sx={{ 
            py: { xs: 2, sm: 3, md: 4 }, // Responsive vertical padding
          }}>
            {/* Page title */}
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ 
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }, // Responsive font size
              }}
            >
              Minhas Farmácias Favoritas
            </Typography>

            {/* Error alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ mb: { xs: 2, sm: 3 } }} 
                  onClose={() => setError(null)}
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

            {/* Empty state */}
            {!isLoading && pharmacies.length === 0 && (
              <Grow in timeout={600}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: { xs: '300px', sm: '400px' }, // Responsive height
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
                    Você ainda não tem farmácias favoritas
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font
                    }}
                  >
                    Adicione farmácias aos favoritos para acessá-las rapidamente aqui.
                  </Typography>
                  <Link href="/" passHref style={{ textDecoration: 'none' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} // Responsive button
                    >
                      Buscar Farmácias
                    </Button>
                  </Link>
                </Box>
              </Grow>
            )}

            {/* Pharmacy list */}
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

      {/* Snackbar for feedback */}
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
