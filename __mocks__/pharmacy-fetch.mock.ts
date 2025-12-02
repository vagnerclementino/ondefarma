global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: [
        {
          cnpj: '11916556000149',
          name: 'FARMACIA QUEIROZ CANEDO LTDA',
          address: 'AVENIDA DONA BALDOINA, 36',
          neighborhood: 'CENTRO',
          city: 'BELO HORIZONTE',
          state: 'MG',
        },
      ],
      pagination: {
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }),
  })
) as jest.Mock;
