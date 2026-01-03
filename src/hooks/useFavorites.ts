import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'farmacia-popular-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const favArray = Array.isArray(parsed) ? parsed : [];
        setFavorites(favArray);
      }
      setIsLocalStorageAvailable(true);
      setError(null);
    } catch (err) {
      setIsLocalStorageAvailable(false);
      setError('Não foi possível carregar seus favoritos. Eles serão salvos apenas durante esta sessão.');
      setFavorites([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (isLocalStorageAvailable) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (err) {
        setIsLocalStorageAvailable(false);
        setError('Não foi possível salvar seus favoritos. Eles serão perdidos ao fechar o navegador.');
      }
    }
  }, [favorites, isLocalStorageAvailable, isInitialized]);

  const addFavorite = useCallback((cnpj: string) => {
    setFavorites((prev) => {
      if (prev.includes(cnpj)) {
        return prev;
      }
      const newFavorites = [...prev, cnpj];
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((cnpj: string) => {
    setFavorites((prev) => prev.filter((id) => id !== cnpj));
  }, []);

  const isFavorite = useCallback(
    (cnpj: string): boolean => {
      return favorites.includes(cnpj);
    },
    [favorites]
  );

  const getFavorites = useCallback((): string[] => {
    return [...favorites];
  }, [favorites]);

  const toggleFavorite = useCallback(
    (cnpj: string) => {
      if (isFavorite(cnpj)) {
        removeFavorite(cnpj);
      } else {
        addFavorite(cnpj);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavorites,
    toggleFavorite,
    isLocalStorageAvailable,
    error,
  };
}