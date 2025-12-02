import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../hooks/useFavorites';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFavorites', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.getFavorites()).toEqual([]);
  });

  it('should add a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.addFavorite(cnpj);
    });

    expect(result.current.isFavorite(cnpj)).toBe(true);
    expect(result.current.getFavorites()).toContain(cnpj);
  });

  it('should remove a favorite', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.addFavorite(cnpj);
    });

    expect(result.current.isFavorite(cnpj)).toBe(true);

    act(() => {
      result.current.removeFavorite(cnpj);
    });

    expect(result.current.isFavorite(cnpj)).toBe(false);
    expect(result.current.getFavorites()).not.toContain(cnpj);
  });

  it('should toggle favorite status', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.toggleFavorite(cnpj);
    });

    expect(result.current.isFavorite(cnpj)).toBe(true);

    act(() => {
      result.current.toggleFavorite(cnpj);
    });

    expect(result.current.isFavorite(cnpj)).toBe(false);
  });

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.addFavorite(cnpj);
      result.current.addFavorite(cnpj);
    });

    expect(result.current.getFavorites().length).toBe(1);
  });

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.addFavorite(cnpj);
    });

    const stored = localStorageMock.getItem('farmacia-popular-favorites');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toContain(cnpj);
  });

  it('should load favorites from localStorage on initialization', () => {
    const cnpj = '12.345.678/0001-90';
    localStorageMock.setItem('farmacia-popular-favorites', JSON.stringify([cnpj]));

    const { result } = renderHook(() => useFavorites());

    expect(result.current.isFavorite(cnpj)).toBe(true);
    expect(result.current.getFavorites()).toContain(cnpj);
  });

  it('should handle localStorage getItem failure gracefully', () => {
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = () => {
      throw new Error('localStorage not available');
    };

    const { result } = renderHook(() => useFavorites());

    expect(result.current.isLocalStorageAvailable).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.getFavorites()).toEqual([]);

    // Restore original method
    localStorageMock.getItem = originalGetItem;
  });

  it('should handle localStorage setItem failure gracefully', () => {
    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    // Mock setItem to throw error
    const originalSetItem = localStorageMock.setItem;
    localStorageMock.setItem = () => {
      throw new Error('localStorage quota exceeded');
    };

    act(() => {
      result.current.addFavorite(cnpj);
    });

    expect(result.current.isLocalStorageAvailable).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.isFavorite(cnpj)).toBe(true); // Still works in memory

    // Restore original method
    localStorageMock.setItem = originalSetItem;
  });

  it('should fallback to in-memory storage when localStorage fails', () => {
    const originalGetItem = localStorageMock.getItem;
    localStorageMock.getItem = () => {
      throw new Error('localStorage not available');
    };

    const { result } = renderHook(() => useFavorites());
    const cnpj = '12.345.678/0001-90';

    act(() => {
      result.current.addFavorite(cnpj);
    });

    // Should still work in memory
    expect(result.current.isFavorite(cnpj)).toBe(true);
    expect(result.current.getFavorites()).toContain(cnpj);

    // Restore original method
    localStorageMock.getItem = originalGetItem;
  });

  it('should handle invalid JSON in localStorage', () => {
    const originalSetItem = localStorageMock.setItem;
    const originalGetItem = localStorageMock.getItem;
    
    // Set invalid JSON
    const store: Record<string, string> = { 'farmacia-popular-favorites': 'invalid json' };
    localStorageMock.getItem = (key: string) => store[key] || null;
    localStorageMock.setItem = (key: string, value: string) => {
      store[key] = value;
    };

    const { result } = renderHook(() => useFavorites());

    expect(result.current.isLocalStorageAvailable).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.getFavorites()).toEqual([]);

    // Restore
    localStorageMock.setItem = originalSetItem;
    localStorageMock.getItem = originalGetItem;
  });

  it('should handle non-array data in localStorage', () => {
    const originalSetItem = localStorageMock.setItem;
    const originalGetItem = localStorageMock.getItem;
    
    // Set non-array data
    const store: Record<string, string> = { 'farmacia-popular-favorites': JSON.stringify({ invalid: 'data' }) };
    localStorageMock.getItem = (key: string) => store[key] || null;
    localStorageMock.setItem = (key: string, value: string) => {
      store[key] = value;
    };

    const { result } = renderHook(() => useFavorites());

    expect(result.current.getFavorites()).toEqual([]);

    // Restore
    localStorageMock.setItem = originalSetItem;
    localStorageMock.getItem = originalGetItem;
  });
});
