import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const states = new Set<string>();
  const filePath = path.join(process.cwd(), 'data', 'pharmacies.csv');

  try {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', () => {
        // All pharmacies in the CSV are from MG
        states.add('MG');
      })
      .on('end', () => {
        // Set cache headers (24 hours)
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        res.status(200).json(Array.from(states).sort());
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
