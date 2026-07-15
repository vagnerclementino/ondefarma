import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Pharmacy } from '@/types/pharmacy';

interface PharmacyFilters {
  state?: string;
  city?: string;
  neighborhood?: string;
}

interface PharmacyCache {
  all: Pharmacy[];
  states: string[];
  citiesByState: Map<string, string[]>;
  neighborhoodsByCityState: Map<string, string[]>;
  byCnpj: Map<string, Pharmacy>;
}

let inMemoryCache: PharmacyCache | null = null;
let loadingPromise: Promise<PharmacyCache> | null = null;

function normalize(value?: string): string | undefined {
  return value?.toUpperCase();
}

function cityStateKey(city: string, state: string): string {
  return `${city.toUpperCase()}::${state.toUpperCase()}`;
}

async function loadCache(): Promise<PharmacyCache> {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = new Promise((resolve, reject) => {
    const rows: Pharmacy[] = [];
    const filePath = path.join(process.cwd(), 'src', 'data', 'pharmacies.csv');

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => {
          const headerMap: { [key: string]: string } = {
            CNPJ: 'cnpj',
            Farmácia: 'name',
            Endereço: 'address',
            Bairro: 'neighborhood',
          };
          return headerMap[header] || header.toLowerCase();
        },
      }))
      .on('data', (data: Pharmacy) => {
        rows.push({
          ...data,
          city: 'BELO HORIZONTE',
          state: 'MG',
        });
      })
      .on('end', () => {
        const statesSet = new Set<string>();
        const citiesByStateSet = new Map<string, Set<string>>();
        const neighborhoodsByCityStateSet = new Map<string, Set<string>>();
        const byCnpj = new Map<string, Pharmacy>();

        rows.forEach((pharmacy) => {
          if (pharmacy.state) {
            statesSet.add(pharmacy.state);

            if (!citiesByStateSet.has(pharmacy.state)) {
              citiesByStateSet.set(pharmacy.state, new Set());
            }

            if (pharmacy.city) {
              citiesByStateSet.get(pharmacy.state)?.add(pharmacy.city);
            }
          }

          if (pharmacy.city && pharmacy.state && pharmacy.neighborhood) {
            const key = cityStateKey(pharmacy.city, pharmacy.state);
            if (!neighborhoodsByCityStateSet.has(key)) {
              neighborhoodsByCityStateSet.set(key, new Set());
            }
            neighborhoodsByCityStateSet.get(key)?.add(pharmacy.neighborhood);
          }

          byCnpj.set(pharmacy.cnpj, pharmacy);
        });

        const citiesByState = new Map<string, string[]>();
        citiesByStateSet.forEach((value, key) => {
          citiesByState.set(key, Array.from(value).sort());
        });

        const neighborhoodsByCityState = new Map<string, string[]>();
        neighborhoodsByCityStateSet.forEach((value, key) => {
          neighborhoodsByCityState.set(key, Array.from(value).sort());
        });

        inMemoryCache = {
          all: rows,
          states: Array.from(statesSet).sort(),
          citiesByState,
          neighborhoodsByCityState,
          byCnpj,
        };

        resolve(inMemoryCache);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export async function readPharmaciesFromCSV(filters?: PharmacyFilters): Promise<Pharmacy[]> {
  const cache = await loadCache();

  if (!filters || (!filters.state && !filters.city && !filters.neighborhood)) {
    return cache.all;
  }

  const state = normalize(filters.state);
  const city = normalize(filters.city);
  const neighborhood = normalize(filters.neighborhood);

  return cache.all.filter((pharmacy) => {
    if (state && normalize(pharmacy.state) !== state) return false;
    if (city && normalize(pharmacy.city) !== city) return false;
    if (neighborhood && normalize(pharmacy.neighborhood) !== neighborhood) return false;
    return true;
  });
}

export async function getPharmaciesByCnpjs(cnpjs: string[]): Promise<Pharmacy[]> {
  if (cnpjs.length === 0) {
    return [];
  }

  const cache = await loadCache();
  return cnpjs
    .map((cnpj) => cache.byCnpj.get(cnpj))
    .filter((pharmacy): pharmacy is Pharmacy => Boolean(pharmacy));
}

export async function getStates(): Promise<string[]> {
  const cache = await loadCache();
  return cache.states;
}

export async function getCities(state: string): Promise<string[]> {
  const cache = await loadCache();
  return cache.citiesByState.get(state.toUpperCase()) || [];
}

export async function getNeighborhoods(city: string, state: string): Promise<string[]> {
  const cache = await loadCache();
  return cache.neighborhoodsByCityState.get(cityStateKey(city.toUpperCase(), state.toUpperCase())) || [];
}
