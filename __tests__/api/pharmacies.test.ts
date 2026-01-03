import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/pharmacies';

// Helper to wait for stream-based API responses
const waitForResponse = (res: any): Promise<void> => {
  return new Promise((resolve) => {
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      originalEnd.apply(res, args);
      resolve();
    };
  });
};

describe('/api/pharmacies', () => {
  it('returns 405 for non-GET requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    });
  });

  it('returns pharmacies with pagination', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {},
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('pagination');
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.pagination).toHaveProperty('page');
    expect(data.pagination).toHaveProperty('limit');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('totalPages');
    expect(data.pagination).toHaveProperty('hasNextPage');
    expect(data.pagination).toHaveProperty('hasPrevPage');
  });

  it('filters pharmacies by state', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        state: 'MG',
      },
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data.data.length).toBeGreaterThan(0);
    data.data.forEach((pharmacy: any) => {
      expect(pharmacy.state).toBe('MG');
    });
  });

  it('filters pharmacies by city', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        state: 'MG',
        city: 'BELO HORIZONTE',
      },
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data.data.length).toBeGreaterThan(0);
    data.data.forEach((pharmacy: any) => {
      expect(pharmacy.city).toBe('BELO HORIZONTE');
      expect(pharmacy.state).toBe('MG');
    });
  });

  it('respects pagination limit parameter', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        limit: '5',
      },
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data.pagination.limit).toBe(5);
    expect(data.data.length).toBeLessThanOrEqual(5);
  });

  it('sets cache headers to 5 minutes', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {},
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['cache-control']).toBe('public, max-age=300, s-maxage=300');
  });

  it('returns pharmacies with all required fields', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        limit: '1',
      },
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    if (data.data.length > 0) {
      const pharmacy = data.data[0];
      expect(pharmacy).toHaveProperty('cnpj');
      expect(pharmacy).toHaveProperty('name');
      expect(pharmacy).toHaveProperty('address');
      expect(pharmacy).toHaveProperty('neighborhood');
      expect(pharmacy).toHaveProperty('city');
      expect(pharmacy).toHaveProperty('state');
    }
  });
});
