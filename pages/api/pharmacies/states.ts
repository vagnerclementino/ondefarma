import { NextApiRequest, NextApiResponse } from 'next';
import { getStates } from '../../../lib/pharmacyData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const states = await getStates();
    
    // Set cache headers (24 hours)
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.status(200).json(states);
  } catch (error) {
    console.error('Error reading states:', error);
    res.status(500).json({ error: 'Error reading states' });
  }
}
