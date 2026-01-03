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
import { Pharmacy } from '@/types/pharmacy';
import { Header, Footer, PharmacyList } from '@/components/organisms';
import { Button } from '@/components/atoms';
import { useFavorites } from '@/hooks/useFavorites';

const ScrollToTop = dynamic(() => import('@/components/atoms/ScrollToTop'), {
  ssr: false,
});

export default function Favorites() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();
  
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchFavoritePharmacies = async () => {
      if (favorites.length === 0) {
        setPharmacies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/pharmacies/by-cnpj', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cnpjs: favorites }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar farmácias');
        }
        
        const data: unknown = await response.json();
        
        const isValidApiResponse = (data: unknown): data is { data: Pharmacy[] } => {
          return (
            typeof data === 'object' &&
            data !== null &&
            'data' in data &&
            Array.isArray((data as any).data)
          );
        };
        
        if (!isValidApiResponse(data)) {
          throw new Error('Resposta da API em formato inválido');
        }
        
        const favoritePharmacies = data.data;
        
        setPharmacies(favoritePharmacies);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Erro ao carregar farmácias favoritas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritePharmacies();
    return () => controller.abort();
  }, [favorites]);

  const handleFavoriteToggle = (cnpj: string) => {
    const isCurrentlyFavorite = favorites.includes(cnpj);
    toggleFavorite(cnpj);
    
    const message = isCurrentlyFavorite 
      ? 'Farmácia removida dos favoritos'
      : 'Farmácia adicionada aos favoritos';
    
    setSnackbarMessage(message);
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
                    Nenhuma farmácia favorita
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
