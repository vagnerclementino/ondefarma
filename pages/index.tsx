import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import { Pharmacy } from '../types/pharmacy';
import { Header, Footer } from '../components/organisms';
import { FilterPanel } from '../components/molecules';
import { PharmacyList } from '../components/organisms';
import { ScrollToTop } from '../components/atoms';
import { useFavorites } from '../hooks/useFavorites';

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
  
  // Data states
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [states, setStates] = useState<string[]>(initialStates);
  const [cities, setCities] = useState<string[]>(initialCities);
  const [neighborhoods, setNeighborhoods] = useState<string[]>(initialNeighborhoods);
  
  // Loading states
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingNeighborhoods, setIsLoadingNeighborhoods] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(initialError || null);
  
  // Favorites hook
  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();

  // Fetch pharmacies when filters change
  useEffect(() => {
    const fetchPharmacies = async () => {
      setIsLoadingPharmacies(true);
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (selectedState) params.append('state', selectedState);
        if (selectedCity) params.append('city', selectedCity);
        if (selectedNeighborhood) params.append('neighborhood', selectedNeighborhood);
        
        const response = await fetch(`/api/pharmacies?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar farmácias');
        }
        
        const data = await response.json();
        setPharmacies(data.data || []);
      } catch (err) {
        console.error('Error fetching pharmacies:', err);
        setError('Erro ao carregar farmácias. Por favor, tente novamente.');
        setPharmacies([]);
      } finally {
        setIsLoadingPharmacies(false);
      }
    };

    fetchPharmacies();
  }, [selectedState, selectedCity, selectedNeighborhood]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      setSelectedCity('');
      return;
    }

    const fetchCities = async () => {
      setIsLoadingCities(true);
      
      try {
        const response = await fetch(`/api/pharmacies/cities?state=${selectedState}`);
        
        if (!response.ok) {
          throw new Error('Erro ao carregar cidades');
        }
        
        const data = await response.json();
        setCities(data);
        
        // Reset city selection if current city is not in the new list
        if (selectedCity && !data.includes(selectedCity)) {
          setSelectedCity('');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  // Fetch neighborhoods when city changes
  useEffect(() => {
    if (!selectedCity || !selectedState) {
      setNeighborhoods([]);
      setSelectedNeighborhood('');
      return;
    }

    const fetchNeighborhoods = async () => {
      setIsLoadingNeighborhoods(true);
      
      try {
        const response = await fetch(
          `/api/pharmacies/neighborhoods?state=${selectedState}&city=${selectedCity}`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao carregar bairros');
        }
        
        const data = await response.json();
        setNeighborhoods(data);
        
        // Reset neighborhood selection if current neighborhood is not in the new list
        if (selectedNeighborhood && !data.includes(selectedNeighborhood)) {
          setSelectedNeighborhood('');
        }
      } catch (err) {
        console.error('Error fetching neighborhoods:', err);
        setNeighborhoods([]);
      } finally {
        setIsLoadingNeighborhoods(false);
      }
    };

    fetchNeighborhoods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedState]);

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
          px: { xs: 2, sm: 3, md: 4 }, // Responsive horizontal padding
        }}
      >
        <Fade in timeout={500}>
          <Box sx={{ 
            py: { xs: 2, sm: 3, md: 4 }, // Responsive vertical padding
          }}>
            {/* Error alerts */}
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

            {/* Filter panel */}
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
