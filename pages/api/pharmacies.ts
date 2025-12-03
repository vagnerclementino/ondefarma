import { NextApiRequest, NextApiResponse } from 'next';
import { readPharmaciesFromCSV } from '../../lib/pharmacyData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    // Read pharmacies with filters
    const results = await readPharmaciesFromCSV({
      state: stateParam,
      city: cityParam,
      neighborhood: neighborhoodParam,
    });

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
  } catch (error) {
    console.error('Error reading pharmacy data:', error);
    res.status(500).json({ error: 'Error reading pharmacy data' });
  }
}
