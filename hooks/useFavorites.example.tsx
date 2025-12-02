/**
 * Exemplo de uso do hook useFavorites
 * 
 * Este arquivo demonstra como integrar o sistema de favoritos
 * em componentes React.
 */

import { useFavorites } from './useFavorites';
import { Pharmacy } from '../types/pharmacy';

export function PharmacyListExample() {
  const { 
    isFavorite, 
    toggleFavorite, 
    error,
    isLocalStorageAvailable 
  } = useFavorites();

  // Exemplo de farmácia
  const pharmacy: Pharmacy = {
    cnpj: '12.345.678/0001-90',
    name: 'Farmácia Exemplo',
    address: 'Rua Exemplo, 123',
    neighborhood: 'Centro',
    city: 'Belo Horizonte',
    state: 'MG'
  };

  return (
    <div>
      {/* Exibir mensagem de erro se localStorage não estiver disponível */}
      {error && (
        <div style={{ backgroundColor: '#fff3cd', padding: '10px', marginBottom: '10px' }}>
          ⚠️ {error}
        </div>
      )}

      <div>
        <h3>{pharmacy.name}</h3>
        <p>{pharmacy.address}</p>
        
        {/* Botão de favorito */}
        <button 
          onClick={() => toggleFavorite(pharmacy.cnpj)}
          style={{
            backgroundColor: isFavorite(pharmacy.cnpj) ? '#ff4444' : '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isFavorite(pharmacy.cnpj) ? '❤️ Remover dos Favoritos' : '🤍 Adicionar aos Favoritos'}
        </button>
      </div>

      {!isLocalStorageAvailable && (
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          Nota: Seus favoritos serão perdidos ao fechar o navegador.
        </p>
      )}
    </div>
  );
}

export function FavoritesPageExample() {
  const { getFavorites } = useFavorites();
  const favoriteCnpjs = getFavorites();

  return (
    <div>
      <h2>Minhas Farmácias Favoritas</h2>
      {favoriteCnpjs.length === 0 ? (
        <p>Você ainda não tem farmácias favoritas.</p>
      ) : (
        <ul>
          {favoriteCnpjs.map(cnpj => (
            <li key={cnpj}>CNPJ: {cnpj}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
