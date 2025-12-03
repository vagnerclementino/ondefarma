import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import { Pharmacy } from '../types/pharmacy';
import { Header, Footer } from '../components/organisms';
import { FilterPanel } from '../components/molecules';
import { PharmacyList } from '../components/organisms';
import { useFavorites } from '../hooks/useFavorites';
import { usePharmacies, useStates, useCities, useNeighborhoods } from '../hooks/usePharmacies';

const ScrollToTop = dynamic(() => import('../components/atoms/ScrollToTop'), {
  ssr: false,
});

interface HomeProps {
  initialPharmacies: Pharmacy[];
  initialStates: string[];
  initialCities: string[];
  initialNeighborhoods: string[];
  error?: string;
}

export default function Home({ 
  initialPharmacies, 
  initialStates,
  initialCities,
  initialNeighborhoods,
  error: initialError 
}: HomeProps) {
  // Filter states
  const [selectedState, setSelectedState] = useState<string>('MG');
  const [selectedCity, setSelectedCity] = useState<string>('BELO HORIZONTE');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  
  // Favorites hook
  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();
  
  // SWR hooks for data fetching with automatic caching
  const { 
    pharmacies, 
    isLoading: isLoadingPharmacies, 
    error: pharmaciesError 
  } = usePharmacies(selectedState, selectedCity, selectedNeighborhood);
  
  const { 
    states, 
    isLoading: isLoadingStates 
  } = useStates();
  
  const { 
    cities, 
    isLoading: isLoadingCities 
  } = useCities(selectedState);
  
  const { 
    neighborhoods, 
    isLoading: isLoadingNeighborhoods 
  } = useNeighborhoods(selectedCity, selectedState);
  
  // Combined error state
  const error = initialError || pharmaciesError;
  
  // Reset city when state changes and current city is not in new list
  useEffect(() => {
    if (selectedCity && cities.length > 0 && !cities.includes(selectedCity)) {
      setSelectedCity('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);
  
  // Reset neighborhood when city changes and current neighborhood is not in new list
  useEffect(() => {
    if (selectedNeighborhood && neighborhoods.length > 0 && !neighborhoods.includes(selectedNeighborhood)) {
      setSelectedNeighborhood('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [neighborhoods]);

  // Update URL with query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state', selectedState);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedNeighborhood) params.append('neighborhood', selectedNeighborhood);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', newUrl);
  }, [selectedState, selectedCity, selectedNeighborhood]);

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

            <FilterPanel
              selectedState={selectedState}
              states={states}
              onStateChange={setSelectedState}
              selectedCity={selectedCity}
              cities={cities}
              onCityChange={setSelectedCity}
              selectedNeighborhood={selectedNeighborhood}
              neighborhoods={neighborhoods}
              onNeighborhoodChange={setSelectedNeighborhood}
              loadingCities={isLoadingCities}
              loadingNeighborhoods={isLoadingNeighborhoods}
            />

            <PharmacyList
              pharmacies={pharmacies}
              isLoading={isLoadingPharmacies}
              favoritePharmacies={favorites}
              onFavoriteToggle={toggleFavorite}
            />
          </Box>
        </Fade>
      </Container>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  try {
    // Get query params from URL
    const { state = 'MG', city = 'BELO HORIZONTE', neighborhood = '' } = context.query;
    
    // Import data functions dynamically to avoid bundling in client
    const { readPharmaciesFromCSV, getStates, getCities, getNeighborhoods } = await import('../lib/pharmacyData');
    
    // Fetch initial data directly from CSV (no HTTP calls needed)
    const [pharmacies, states, cities, neighborhoods] = await Promise.all([
      readPharmaciesFromCSV({
        state: state as string,
        city: city as string,
        neighborhood: neighborhood as string || undefined,
      }),
      getStates(),
      getCities(state as string),
      city ? getNeighborhoods(city as string, state as string) : Promise.resolve([]),
    ]);

    // Apply pagination for initial load
    const limit = 50;
    const paginatedPharmacies = pharmacies.slice(0, limit);

    return {
      props: {
        initialPharmacies: paginatedPharmacies,
        initialStates: states,
        initialCities: cities,
        initialNeighborhoods: neighborhoods,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    return {
      props: {
        initialPharmacies: [],
        initialStates: [],
        initialCities: [],
        initialNeighborhoods: [],
        error: 'Erro ao carregar dados iniciais',
      },
    };
  }
};
