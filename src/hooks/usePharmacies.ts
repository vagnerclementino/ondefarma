import useSWR from 'swr';
import { Pharmacy } from '@/types/pharmacy';

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Erro ao carregar dados');
  }
  
  return response.json();
};

interface PharmacyApiResponse {
  data: Pharmacy[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Hook for fetching pharmacies with filters
export function usePharmacies(
  state?: string,
  city?: string,
  neighborhood?: string,
  page: number = 1,
  limit: number = 50,
  fallbackData?: PharmacyApiResponse
) {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (city) params.append('city', city);
  if (neighborhood) params.append('neighborhood', neighborhood);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data, error, isLoading, mutate } = useSWR<PharmacyApiResponse>(
    `/api/pharmacies?${params.toString()}`,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: false,
      revalidateOnMount: fallbackData ? false : undefined,
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
export function useStates(fallbackData?: string[]) {
  const { data, error, isLoading } = useSWR<string[]>(
    '/api/pharmacies/states',
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: fallbackData ? false : undefined,
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
export function useCities(state?: string, fallbackData?: string[]) {
  const { data, error, isLoading } = useSWR<string[]>(
    state ? `/api/pharmacies/cities?state=${state}` : null,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: fallbackData ? false : undefined,
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
export function useNeighborhoods(city?: string, state?: string, fallbackData?: string[]) {
  const { data, error, isLoading } = useSWR<string[]>(
    city && state ? `/api/pharmacies/neighborhoods?state=${state}&city=${city}` : null,
    fetcher,
    {
      fallbackData,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnMount: fallbackData ? false : undefined,
      dedupingInterval: 60000,
    }
  );

  return {
    neighborhoods: (data || []) as string[],
    isLoading,
    error: error ? 'Erro ao carregar bairros' : null,
  };
}
