import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataUpdateInfo from '@/components/atoms/DataUpdateInfo';

describe('DataUpdateInfo', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('renders formatted date when environment variable is set', () => {
    process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = '2024-12-03';
    
    render(<DataUpdateInfo />);
    
    expect(screen.getByText('Dados atualizados em: 03/12/2024')).toBeInTheDocument();
  });

  it('formats date correctly in Brazilian format (DD/MM/YYYY)', () => {
    process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = '2024-01-15';
    
    render(<DataUpdateInfo />);
    
    expect(screen.getByText('Dados atualizados em: 15/01/2024')).toBeInTheDocument();
  });

  it('displays default message when environment variable is not set', () => {
    delete process.env.NEXT_PUBLIC_DATA_UPDATE_DATE;
    
    render(<DataUpdateInfo />);
    
    expect(screen.getByText('Data de atualização não disponível')).toBeInTheDocument();
  });

  it('displays default message when environment variable is empty', () => {
    process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = '';
    
    render(<DataUpdateInfo />);
    
    expect(screen.getByText('Data de atualização não disponível')).toBeInTheDocument();
  });

  it('renders as Typography component with correct styling', () => {
    process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = '2024-12-03';
    
    const { container } = render(<DataUpdateInfo />);
    
    const typography = container.querySelector('.MuiTypography-root');
    expect(typography).toBeInTheDocument();
    expect(typography).toHaveClass('MuiTypography-caption');
  });
});
