import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Library.css';

interface LibraryGame {
  purchase_id: number;
  purchased_at: string;
  id: number;
  titulo: string;
  descricao?: string;
  preco: number;
  plataforma?: string;
  imagem_url?: string;
  estoque?: number;
  requisitos_minimos?: string;
  requisitos_recomendados?: string;
}

function Library() {
  const navigate = useNavigate();
  const [games, setGames] = useState<LibraryGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState<LibraryGame | null>(null);

  const currentUser = JSON.parse(localStorage.getItem('userUser') || 'null');

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/users/library');
        const libraryGames: LibraryGame[] = Array.isArray(response.data)
          ? response.data
          : [];

        setGames(libraryGames);

        if (currentUser?.id) {
          localStorage.setItem(
            `library_${currentUser.id}`,
            JSON.stringify(libraryGames)
          );
        }
      } catch (err: any) {
        const fallback = currentUser?.id
          ? JSON.parse(localStorage.getItem(`library_${currentUser.id}`) || '[]')
          : [];

        setGames(Array.isArray(fallback) ? fallback : []);
        setError(
          err?.response?.data?.message ||
            'Não foi possível carregar sua biblioteca.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [currentUser?.id]);

  const totalJogos = useMemo(() => games.length, [games]);

  const abrirLauncher = (game: LibraryGame) => {
    setSelectedGame(game);
  };

  const fecharLauncher = () => {
    setSelectedGame(null);
  };

  const jogarAgora = () => {
    if (!selectedGame) return;

    alert(`Iniciando ${selectedGame.titulo}...`);
    setSelectedGame(null);
  };

  if (loading) {
    return (
      <div className="library-page">
        <div className="library-shell">
          <div className="library-header">
            <div>
              <h1>Sua Biblioteca</h1>
              <p>Carregando seus jogos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-shell">
        <div className="library-header">
          <div>
            <h1>Sua Biblioteca</h1>
            <p>{totalJogos} jogo(s) adquirido(s)</p>
          </div>

          <button
            className="library-store-button"
            onClick={() => navigate('/store')}
          >
            Ir para Store
          </button>
        </div>

        {error && <div className="library-warning">{error}</div>}

        {games.length === 0 ? (
          <div className="library-empty">
            <h2>Você ainda não possui jogos na biblioteca</h2>
            <p>Compre seus jogos na loja para vê-los aqui.</p>

            <button onClick={() => navigate('/store')}>Explorar jogos</button>
          </div>
        ) : (
          <div className="library-grid">
            {games.map((game) => (
              <div
                key={`${game.purchase_id}-${game.id}`}
                className="library-card"
              >
                <div className="library-image-wrap">
                  <img
                    src={
                      game.imagem_url ||
                      'https://via.placeholder.com/400x220?text=Jogo'
                    }
                    alt={game.titulo}
                    className="library-image"
                  />
                </div>

                <div className="library-content">
                  <h3 className="library-title">{game.titulo}</h3>

                  <span className="library-platform">
                    {game.plataforma || 'PC'}
                  </span>

                  <p className="library-description">
                    {game.descricao || 'Sem descrição disponível.'}
                  </p>

                  <div className="library-meta">
                    <span>
                      Comprado em:{' '}
                      {new Date(game.purchased_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="library-actions">
                    <button
                      className="open-app-button"
                      onClick={() => abrirLauncher(game)}
                    >
                      Abrir no App
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame && (
        <div className="launcher-overlay" onClick={fecharLauncher}>
          <div
            className="launcher-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                selectedGame.imagem_url ||
                'https://via.placeholder.com/500x280?text=Jogo'
              }
              alt={selectedGame.titulo}
              className="launcher-image"
            />

            <div className="launcher-body">
              <span className="launcher-badge">
                {selectedGame.plataforma || 'PC'}
              </span>

              <h2>{selectedGame.titulo}</h2>

              <p className="launcher-description">
                {selectedGame.descricao || 'Sem descrição disponível.'}
              </p>

              <div className="launcher-meta">
                <p>
                  <strong>Comprado em:</strong>{' '}
                  {new Date(selectedGame.purchased_at).toLocaleDateString(
                    'pt-BR'
                  )}
                </p>

                {selectedGame.requisitos_minimos && (
                  <p>
                    <strong>Requisitos mínimos:</strong>{' '}
                    {selectedGame.requisitos_minimos}
                  </p>
                )}
              </div>

              <div className="launcher-actions">
                <button className="play-btn" onClick={jogarAgora}>
                  Jogar agora
                </button>

                <button className="close-btn" onClick={fecharLauncher}>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Library;