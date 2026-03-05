import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pharmacy } from '@/types/pharmacy';
import { Header, Footer } from '@/components/organisms';
import { FilterPanel } from '@/components/molecules';
import { PharmacyList } from '@/components/organisms';
import { useFavorites } from '@/hooks/useFavorites';
import { usePharmacies, useStates, useCities, useNeighborhoods } from '@/hooks/usePharmacies';

const ScrollToTop = dynamic(() => import('@/components/atoms/ScrollToTop'), {
  ssr: false,
});

interface HomeProps {
  initialPharmacies: Pharmacy[];
  initialStates: string[];
  initialCities: string[];
  initialNeighborhoods: string[];
  initialSelectedState: string;
  initialSelectedCity: string;
  initialSelectedNeighborhood: string;
  error?: string;
}

export default function Home({
  initialPharmacies,
  initialStates,
  initialCities,
  initialNeighborhoods,
  initialSelectedState,
  initialSelectedCity,
  initialSelectedNeighborhood,
  error: initialError,
}: HomeProps) {
  const [selectedState, setSelectedState] = useState<string>(initialSelectedState);
  const [selectedCity, setSelectedCity] = useState<string>(initialSelectedCity);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(initialSelectedNeighborhood);

  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();

  const shouldUseInitialData =
    selectedState === initialSelectedState &&
    selectedCity === initialSelectedCity &&
    selectedNeighborhood === initialSelectedNeighborhood;

  const {
    pharmacies,
    isLoading: isLoadingPharmacies,
    error: pharmaciesError,
  } = usePharmacies(
    selectedState,
    selectedCity,
    selectedNeighborhood,
    1,
    50,
    shouldUseInitialData ? { data: initialPharmacies } : undefined
  );

  const { states } = useStates(initialStates);

  const {
    cities,
    isLoading: isLoadingCities,
  } = useCities(
    selectedState,
    selectedState === initialSelectedState ? initialCities : undefined
  );

  const {
    neighborhoods,
    isLoading: isLoadingNeighborhoods,
  } = useNeighborhoods(
    selectedCity,
    selectedState,
    selectedCity === initialSelectedCity && selectedState === initialSelectedState
      ? initialNeighborhoods
      : undefined
  );

  const error = initialError || pharmaciesError;

  useEffect(() => {
    if (selectedCity && cities.length > 0 && !cities.includes(selectedCity)) {
      setSelectedCity('');
    }
  }, [cities, selectedCity]);

  useEffect(() => {
    if (selectedNeighborhood && neighborhoods.length > 0 && !neighborhoods.includes(selectedNeighborhood)) {
      setSelectedNeighborhood('');
    }
  }, [neighborhoods, selectedNeighborhood]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedState) params.append('state', selectedState);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedNeighborhood) params.append('neighborhood', selectedNeighborhood);

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';
    window.history.replaceState({}, '', newUrl);
  }, [selectedState, selectedCity, selectedNeighborhood]);

  return (
    <div className="page-shell">
      <Header />
      <main className="app-container page-content">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {favoritesError && (
          <Alert className="mb-4 border-yellow-300 bg-yellow-50 text-yellow-800">
            <AlertDescription>{favoritesError}</AlertDescription>
          </Alert>
        )}

        <FilterPanel
          selectedState={selectedState}
          states={states.length ? states : initialStates}
          onStateChange={setSelectedState}
          selectedCity={selectedCity}
          cities={cities.length ? cities : initialCities}
          onCityChange={setSelectedCity}
          selectedNeighborhood={selectedNeighborhood}
          neighborhoods={neighborhoods.length ? neighborhoods : initialNeighborhoods}
          onNeighborhoodChange={setSelectedNeighborhood}
          loadingCities={isLoadingCities}
          loadingNeighborhoods={isLoadingNeighborhoods}
        />

        <PharmacyList
          pharmacies={pharmacies.length ? pharmacies : initialPharmacies}
          isLoading={isLoadingPharmacies}
          favoritePharmacies={favorites}
          onFavoriteToggle={toggleFavorite}
        />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
  try {
    const { state = 'MG', city = 'BELO HORIZONTE', neighborhood = '' } = context.query;

    const { readPharmaciesFromCSV, getStates, getCities, getNeighborhoods } = await import('../lib/pharmacyData');

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

    const limit = 50;
    const paginatedPharmacies = pharmacies.slice(0, limit);

    return {
      props: {
        initialPharmacies: paginatedPharmacies,
        initialStates: states,
        initialCities: cities,
        initialNeighborhoods: neighborhoods,
        initialSelectedState: state as string,
        initialSelectedCity: city as string,
        initialSelectedNeighborhood: neighborhood as string,
      },
    };
  } catch {
    return {
      props: {
        initialPharmacies: [],
        initialStates: [],
        initialCities: [],
        initialNeighborhoods: [],
        initialSelectedState: 'MG',
        initialSelectedCity: 'BELO HORIZONTE',
        initialSelectedNeighborhood: '',
        error: 'Erro ao carregar dados iniciais',
      },
    };
  }
};
