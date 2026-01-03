import type { NextApiRequest, NextApiResponse } from 'next';
import { readPharmaciesFromCSV } from '@/lib/pharmacyData';
import { Pharmacy } from '@/types/pharmacy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cnpjs } = req.body;

    if (!cnpjs || !Array.isArray(cnpjs)) {
      return res.status(400).json({ error: 'CNPJs array is required' });
    }

    if (cnpjs.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const allPharmacies = await readPharmaciesFromCSV({});

    const pharmacies = allPharmacies.filter((pharmacy: Pharmacy) =>
      cnpjs.includes(pharmacy.cnpj)
    );

    return res.status(200).json({ data: pharmacies });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
