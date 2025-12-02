import useSWR from 'swr';
import { Pharmacy } from '../types/pharmacy';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar dados');
  }
  
  return response.json();
};

// Hook for fetching pharmacies with filters
export function usePharmacies(
  state?: string,
  city?: string,
  neighborhood?: string,
  page: number = 1,
  limit: number = 50
) {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (city) params.append('city', city);
  if (neighborhood) params.append('neighborhood', neighborhood);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data, error, isLoading, mutate } = useSWR(
    `/api/pharmacies?${params.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      refreshInterval: 0,
    }
  );

  return {
    pharmacies: (data?.data || []) as Pharmacy[],
    pagination: data?.pagination,
    isLoading,
    error: error ? 'Erro ao carregar farmácias' : null,
    mutate,
  };
}

// Hook for fetching states
export function useStates() {
  const { data, error, isLoading } = useSWR(
    '/api/pharmacies/states',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    states: (data || []) as string[],
    isLoading,
    error: error ? 'Erro ao carregar estados' : null,
  };
}

// Hook for fetching cities by state
export function useCities(state?: string) {
  const { data, error, isLoading } = useSWR(
    state ? `/api/pharmacies/cities?state=${state}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    cities: (data || []) as string[],
    isLoading,
    error: error ? 'Erro ao carregar cidades' : null,
  };
}

// Hook for fetching neighborhoods by city and state
export function useNeighborhoods(city?: string, state?: string) {
  const { data, error, isLoading } = useSWR(
    city && state ? `/api/pharmacies/neighborhoods?state=${state}&city=${city}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  return {
    neighborhoods: (data || []) as string[],
    isLoading,
    error: error ? 'Erro ao carregar bairros' : null,
  };
}
