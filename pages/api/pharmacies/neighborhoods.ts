import { NextApiRequest, NextApiResponse } from 'next';
import { getNeighborhoods } from '../../../lib/pharmacyData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

  try {
    const neighborhoods = await getNeighborhoods(city, state);
    
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).json(neighborhoods);
  } catch (error) {
    res.status(500).json({ error: 'Error reading neighborhoods' });
  }
}
