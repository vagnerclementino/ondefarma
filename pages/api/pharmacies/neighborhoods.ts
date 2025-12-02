import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city, state } = req.query;

  if (!city || typeof city !== 'string') {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  if (!state || typeof state !== 'string') {
    return res.status(400).json({ error: 'State parameter is required' });
  }

  const neighborhoods = new Set<string>();
  const filePath = path.join(process.cwd(), 'data', 'pharmacies.csv');

  try {
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
      .on('data', (data: any) => {
        // All pharmacies are from Belo Horizonte, MG
        if (state.toUpperCase() === 'MG' && city.toUpperCase() === 'BELO HORIZONTE') {
          if (data.neighborhood) {
            neighborhoods.add(data.neighborhood);
          }
        }
      })
      .on('end', () => {
        // Set cache headers (24 hours)
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        res.status(200).json(Array.from(neighborhoods).sort());
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
