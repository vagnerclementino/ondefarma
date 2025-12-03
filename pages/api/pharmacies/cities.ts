import { NextApiRequest, NextApiResponse } from 'next';
import { getCities } from '../../../lib/pharmacyData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { state } = req.query;

  if (!state || typeof state !== 'string') {
    return res.status(400).json({ error: 'State parameter is required' });
  }

  try {
    const cities = await getCities(state);
    
    // Set cache headers (24 hours)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error reading cities:', error);
    res.status(500).json({ error: 'Error reading cities' });
  }
}
