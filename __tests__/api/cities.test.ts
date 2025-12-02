import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/pharmacies/cities';

const waitForResponse = (res: any): Promise<void> => {
  return new Promise((resolve) => {
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      originalEnd.apply(res, args);
      resolve();
    };
  });
};

describe('/api/pharmacies/cities', () => {
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

  it('returns 400 when state parameter is missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {},
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'State parameter is required',
    });
  });

  it('returns list of cities for MG state', async () => {
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
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data).toContain('BELO HORIZONTE');
  });

  it('sets cache headers to 24 hours', async () => {
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
    expect(res._getHeaders()['cache-control']).toBe('public, max-age=86400, s-maxage=86400');
  });
});
