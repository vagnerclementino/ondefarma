import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/pharmacies/states';

const waitForResponse = (res: any): Promise<void> => {
  return new Promise((resolve) => {
    const originalEnd = res.end;
    res.end = function(...args: any[]) {
      originalEnd.apply(res, args);
      resolve();
    };
  });
};

describe('/api/pharmacies/states', () => {
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

  it('returns list of states', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it('returns MG as a state', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    
    expect(data).toContain('MG');
  });

  it('sets cache headers to 24 hours', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    const responsePromise = waitForResponse(res);
    handler(req, res);
    await responsePromise;

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()['cache-control']).toBe('public, max-age=86400, s-maxage=86400');
  });
});
