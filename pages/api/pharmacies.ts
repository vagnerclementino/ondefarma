import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { NextApiRequest, NextApiResponse } from 'next';
import { Pharmacy } from '../../types/pharmacy';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results: Pharmacy[] = [];
  const filePath = path.join(process.cwd(), 'data', 'pharmacies.csv');

  const stateParam = typeof req.query.state === 'string' ? req.query.state : undefined;
  const cityParam = typeof req.query.city === 'string' ? req.query.city : undefined;
  const neighborhoodParam = typeof req.query.neighborhood === 'string' ? req.query.neighborhood : undefined;
  
  // Pagination parameters
  const pageParam = typeof req.query.page === 'string' ? parseInt(req.query.page, 10) : 1;
  const limitParam = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 50;
  
  // Validate pagination parameters
  const page = pageParam > 0 ? pageParam : 1;
  const limit = Math.min(limitParam > 0 ? limitParam : 50, 50);

  try {
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => {
          // Map CSV headers to our interface properties
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
        // Add city and state (all pharmacies in the CSV are from Belo Horizonte, MG)
        data.city = 'BELO HORIZONTE';
        data.state = 'MG';

        // Apply filters
        let matches = true;
        
        if (stateParam && data.state !== stateParam.toUpperCase()) {
          matches = false;
        }
        
        if (cityParam && data.city && data.city.toUpperCase() !== cityParam.toUpperCase()) {
          matches = false;
        }
        
        if (neighborhoodParam && data.neighborhood.toUpperCase() !== neighborhoodParam.toUpperCase()) {
          matches = false;
        }

        if (matches) {
          results.push(data);
        }
      })
      .on('end', () => {
        // Apply pagination
        const total = results.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedResults = results.slice(startIndex, endIndex);

        // Set cache headers (5 minutes)
        res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
        res.status(200).json({
          data: paginatedResults,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        });
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Error reading CSV file' });
      });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
