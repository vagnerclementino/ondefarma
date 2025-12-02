import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'farmacia-popular-favorites';

/**
 * Hook para gerenciar favoritos de farmácias usando localStorage
 * Armazena CNPJs das farmácias favoritas
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar favoritos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      console.log('[useFavorites] Loading from localStorage:', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        const favArray = Array.isArray(parsed) ? parsed : [];
        console.log('[useFavorites] Parsed favorites:', favArray);
        setFavorites(favArray);
      }
      setIsLocalStorageAvailable(true);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar favoritos do localStorage:', err);
      setIsLocalStorageAvailable(false);
      setError('Não foi possível carregar seus favoritos. Eles serão salvos apenas durante esta sessão.');
      setFavorites([]);
    } finally {
      // Marca como inicializado após carregar (ou tentar carregar) do localStorage
      setIsInitialized(true);
    }
  }, []);

  // Sincronizar com localStorage quando favoritos mudam (mas só depois de inicializar)
  useEffect(() => {
    // Não salva no localStorage até que tenhamos carregado os dados iniciais
    if (!isInitialized) {
      return;
    }

    if (isLocalStorageAvailable) {
      try {
        console.log('[useFavorites] Saving to localStorage:', favorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (err) {
        console.error('Erro ao salvar favoritos no localStorage:', err);
        setIsLocalStorageAvailable(false);
        setError('Não foi possível salvar seus favoritos. Eles serão perdidos ao fechar o navegador.');
      }
    }
  }, [favorites, isLocalStorageAvailable, isInitialized]);

  /**
   * Adiciona uma farmácia aos favoritos
   * @param cnpj - CNPJ da farmácia
   */
  const addFavorite = useCallback((cnpj: string) => {
    console.log('[useFavorites] Adding favorite:', cnpj);
    setFavorites((prev) => {
      if (prev.includes(cnpj)) {
        console.log('[useFavorites] Already in favorites');
        return prev;
      }
      const newFavorites = [...prev, cnpj];
      console.log('[useFavorites] New favorites list:', newFavorites);
      return newFavorites;
    });
  }, []);

  /**
   * Remove uma farmácia dos favoritos
   * @param cnpj - CNPJ da farmácia
   */
  const removeFavorite = useCallback((cnpj: string) => {
    setFavorites((prev) => prev.filter((id) => id !== cnpj));
  }, []);

  /**
   * Verifica se uma farmácia está nos favoritos
   * @param cnpj - CNPJ da farmácia
   * @returns true se a farmácia está nos favoritos
   */
  const isFavorite = useCallback(
    (cnpj: string): boolean => {
      return favorites.includes(cnpj);
    },
    [favorites]
  );

  /**
   * Retorna a lista de CNPJs favoritos
   * @returns Array de CNPJs
   */
  const getFavorites = useCallback((): string[] => {
    return [...favorites];
  }, [favorites]);

  /**
   * Alterna o estado de favorito de uma farmácia
   * @param cnpj - CNPJ da farmácia
   */
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
