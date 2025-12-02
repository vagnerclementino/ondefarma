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

            {/* Pharmacy list */}
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
    
    // Fetch initial data
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Fetch pharmacies
    const pharmaciesParams = new URLSearchParams();
    if (state) pharmaciesParams.append('state', state as string);
    if (city) pharmaciesParams.append('city', city as string);
    if (neighborhood) pharmaciesParams.append('neighborhood', neighborhood as string);
    
    const [pharmaciesRes, statesRes, citiesRes, neighborhoodsRes] = await Promise.all([
      fetch(`${baseUrl}/api/pharmacies?${pharmaciesParams.toString()}`),
      fetch(`${baseUrl}/api/pharmacies/states`),
      fetch(`${baseUrl}/api/pharmacies/cities?state=${state}`),
      city ? fetch(`${baseUrl}/api/pharmacies/neighborhoods?state=${state}&city=${city}`) : Promise.resolve(null),
    ]);

    if (!pharmaciesRes.ok || !statesRes.ok || !citiesRes.ok) {
      throw new Error('Failed to fetch initial data');
    }

    const pharmaciesData = await pharmaciesRes.json();
    const statesData = await statesRes.json();
    const citiesData = await citiesRes.json();
    const neighborhoodsData = neighborhoodsRes ? await neighborhoodsRes.json() : [];

    return {
      props: {
        initialPharmacies: pharmaciesData.data || [],
        initialStates: statesData || [],
        initialCities: citiesData || [],
        initialNeighborhoods: neighborhoodsData || [],
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
