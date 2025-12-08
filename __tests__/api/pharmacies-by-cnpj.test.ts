import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/pharmacies/by-cnpj';

// Mock do módulo pharmacyData
jest.mock('../../lib/pharmacyData', () => ({
  readPharmaciesFromCSV: jest.fn(),
}));

import { readPharmaciesFromCSV } from '../../lib/pharmacyData';

describe('/api/pharmacies/by-cnpj', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 405 para método GET', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    });
  });

  it('deve retornar 400 se CNPJs não for fornecido', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'CNPJs array is required',
    });
  });

  it('deve retornar 400 se CNPJs não for um array', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { cnpjs: 'not-an-array' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'CNPJs array is required',
    });
  });

  it('deve retornar array vazio se CNPJs estiver vazio', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { cnpjs: [] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ data: [] });
  });

  it('deve retornar farmácias pelos CNPJs fornecidos', async () => {
    const mockPharmacies = [
      {
        cnpj: '12345678000190',
        name: 'Farmácia A',
        address: 'Rua A',
        neighborhood: 'Bairro A',
        city: 'Cidade A',
        state: 'MG',
      },
      {
        cnpj: '98765432000100',
        name: 'Farmácia B',
        address: 'Rua B',
        neighborhood: 'Bairro B',
        city: 'Cidade B',
        state: 'MG',
      },
      {
        cnpj: '11111111000111',
        name: 'Farmácia C',
        address: 'Rua C',
        neighborhood: 'Bairro C',
        city: 'Cidade C',
        state: 'SP',
      },
    ];

    (readPharmaciesFromCSV as jest.Mock).mockResolvedValue(mockPharmacies);

    const { req, res } = createMocks({
      method: 'POST',
      body: { cnpjs: ['12345678000190', '98765432000100'] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data).toHaveLength(2);
    expect(data.data[0].cnpj).toBe('12345678000190');
    expect(data.data[1].cnpj).toBe('98765432000100');
  });

  it('deve retornar 500 em caso de erro', async () => {
    (readPharmaciesFromCSV as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const { req, res } = createMocks({
      method: 'POST',
      body: { cnpjs: ['12345678000190'] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Internal server error',
    });
  });
});
