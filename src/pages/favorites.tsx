import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pharmacy } from '@/types/pharmacy';
import { Header, Footer, PharmacyList } from '@/components/organisms';
import { Button } from '@/components/atoms';
import { useFavorites } from '@/hooks/useFavorites';

const ScrollToTop = dynamic(() => import('@/components/atoms/ScrollToTop'), {
  ssr: false,
});

export default function Favorites() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { favorites, toggleFavorite, error: favoritesError } = useFavorites();

  useEffect(() => {
    const controller = new AbortController();

    const fetchFavoritePharmacies = async () => {
      if (favorites.length === 0) {
        setPharmacies([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/pharmacies/by-cnpj', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cnpjs: favorites }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar farmácias');
        }

        const data: unknown = await response.json();

        const isValidApiResponse = (value: unknown): value is { data: Pharmacy[] } => {
          return typeof value === 'object' && value !== null && 'data' in value && Array.isArray((value as any).data);
        };

        if (!isValidApiResponse(data)) {
          throw new Error('Resposta da API em formato inválido');
        }

        setPharmacies(data.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError('Erro ao carregar farmácias favoritas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoritePharmacies();
    return () => controller.abort();
  }, [favorites]);

  const handleFavoriteToggle = (cnpj: string) => {
    const isCurrentlyFavorite = favorites.includes(cnpj);
    toggleFavorite(cnpj);

    setSnackbarMessage(
      isCurrentlyFavorite
        ? 'Farmácia removida dos favoritos'
        : 'Farmácia adicionada aos favoritos'
    );
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (!snackbarOpen) return;
    const t = setTimeout(() => setSnackbarOpen(false), 3000);
    return () => clearTimeout(t);
  }, [snackbarOpen]);

  return (
    <div className="page-shell">
      <Header />
      <main className="app-container page-content">
        <h1 className="title-h1">Minhas Farmácias Favoritas</h1>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {favoritesError && (
          <Alert className="mb-4 border-yellow-300 bg-yellow-50 text-yellow-800">
            <AlertDescription>{favoritesError}</AlertDescription>
          </Alert>
        )}

        {!isLoading && pharmacies.length === 0 && (
          <section className="surface-card p-8 text-center">
            <h2 className="m-0 mb-2 text-xl font-semibold text-muted-foreground">Nenhuma farmácia favorita</h2>
            <p className="helper-text mb-4">Adicione farmácias aos favoritos para acessá-las rapidamente aqui.</p>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large">Buscar Farmácias</Button>
            </Link>
          </section>
        )}

        {(isLoading || pharmacies.length > 0) && (
          <PharmacyList
            pharmacies={pharmacies}
            isLoading={isLoading}
            favoritePharmacies={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </main>

      {snackbarOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(92vw,420px)]" aria-live="polite">
          <Alert className="favorite-toast">
            <AlertDescription>{snackbarMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </div>
  );
}
