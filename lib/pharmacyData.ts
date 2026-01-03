import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Pharmacy } from '../types/pharmacy';

interface PharmacyFilters {
  state?: string;
  city?: string;
  neighborhood?: string;
}

export function readPharmaciesFromCSV(filters?: PharmacyFilters): Promise<Pharmacy[]> {
  return new Promise((resolve, reject) => {
    const results: Pharmacy[] = [];
    const filePath = path.join(process.cwd(), 'data', 'pharmacies.csv');

    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => {
          const headerMap: { [key: string]: string } = {
            'CNPJ': 'cnpj',
            'Farmácia': 'name',
            'Endereço': 'address',
            'Bairro': 'neighborhood'
          };
          return headerMap[header] || header.toLowerCase();
        }
      }))
      .on('data', (data: Pharmacy) => {
        data.city = 'BELO HORIZONTE';
        data.state = 'MG';

        if (filters) {
          let matches = true;
          
          if (filters.state && data.state !== filters.state.toUpperCase()) {
            matches = false;
          }
          
          if (filters.city && data.city && data.city.toUpperCase() !== filters.city.toUpperCase()) {
            matches = false;
          }
          
          if (filters.neighborhood && data.neighborhood?.toUpperCase() !== filters.neighborhood.toUpperCase()) {
            matches = false;
          }

          if (matches) {
            results.push(data);
          }
        } else {
          results.push(data);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

export async function getStates(): Promise<string[]> {
  const pharmacies = await readPharmaciesFromCSV();
  const states = new Set<string>();
  
  pharmacies.forEach(pharmacy => {
    if (pharmacy.state) {
      states.add(pharmacy.state);
    }
  });
  
  return Array.from(states).sort();
}

export async function getCities(state: string): Promise<string[]> {
  const pharmacies = await readPharmaciesFromCSV({ state });
  const cities = new Set<string>();
  
  pharmacies.forEach(pharmacy => {
    if (pharmacy.city) {
      cities.add(pharmacy.city);
    }
  });
  
  return Array.from(cities).sort();
}

export async function getNeighborhoods(city: string, state: string): Promise<string[]> {
  const pharmacies = await readPharmaciesFromCSV({ city, state });
  const neighborhoods = new Set<string>();
  
  pharmacies.forEach(pharmacy => {
    if (pharmacy.neighborhood) {
      neighborhoods.add(pharmacy.neighborhood);
    }
  });
  
  return Array.from(neighborhoods).sort();
}
