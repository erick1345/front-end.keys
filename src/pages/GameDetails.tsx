import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './GameDetails.css';

interface Game {
  id: number;
  titulo: string;
  descricao: string;
  preco: number | string;
  plataforma: string;
  imagem_url: string;
  estoque: number;
  requisitos_minimos?: string;
  requisitos_recomendados?: string;
}

const GameDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('userUser') || 'null');
  const libraryKey = useMemo(
    () => (user?.id ? `library_${user.id}` : 'library'),
    [user?.id]
  );

  const [library, setLibrary] = useState<Game[]>([]);

  useEffect(() => {
    const savedLibrary = localStorage.getItem(libraryKey);

    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary));
    } else {
      setLibrary([]);
    }
  }, [libraryKey]);

  useEffect(() => {
    const carregarJogo = async () => {
      try {
        const response = await api.get(`/jogos/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do jogo:', error);
        alert('Não foi possível carregar os detalhes do jogo.');
        navigate('/store');
      } finally {
        setLoading(false);
      }
    };

    carregarJogo();
  }, [id, navigate]);

  const alreadyOwned = (gameId: number) => {
    return library.some((item) => item.id === gameId);
  };

  if (loading) {
    return (
      <div className="game-details-page">
        <div className="game-details-container">
          <p>Carregando jogo...</p>
        </div>
      </div>
    );
  }

  if (!game) return null;

  const owned = alreadyOwned(game.id);
  const semEstoque = !game.estoque || game.estoque <= 0;

  const precoFormatado = Number(game.preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleComprarAgora = () => {
    if (owned) return;

    if (semEstoque) {
      alert('Esse jogo está sem estoque no momento.');
      return;
    }

    navigate('/payment', {
      state: { game }
    });
  };

  return (
    <div className="game-details-page">
      <div className="game-details-container">
        <div className="game-details-top">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            ← Voltar
          </button>
        </div>

        <div className="game-details-card">
          <div className="game-details-image-area">
            <img src={game.imagem_url} alt={game.titulo} />
          </div>

          <div className="game-details-info">
            <h1>{game.titulo}</h1>
            <p className="game-platform">🎮 {game.plataforma}</p>
            <p className="game-price">{precoFormatado}</p>
            <p className="game-stock">📦 Estoque: {game.estoque}</p>

            <div className="game-description-box">
              <h2>Sobre o jogo</h2>
              <p>{game.descricao}</p>
            </div>

            <div className="game-requirements">
              <div className="requirements-box">
                <h3>Requisitos mínimos</h3>
                <p>{game.requisitos_minimos || 'Requisitos mínimos não informados.'}</p>
              </div>

              <div className="requirements-box">
                <h3>Requisitos recomendados</h3>
                <p>
                  {game.requisitos_recomendados ||
                    'Requisitos recomendados não informados.'}
                </p>
              </div>
            </div>

            <div className="game-actions">
              <button
                className="buy-button"
                type="button"
                onClick={handleComprarAgora}
                disabled={owned || semEstoque}
              >
                {owned ? 'Já adquirido' : semEstoque ? 'Sem estoque' : 'Comprar agora'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;