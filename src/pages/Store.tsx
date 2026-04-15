import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Store.css';
import Footer from '../components/footer';

interface Game {
  id: number;
  titulo: string;
  preco: number;
  descricao?: string;
  imagem_url?: string;
  estoque?: number;
  plataforma?: string;
}

function Store() {
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<Game[]>([]);
  const [library, setLibrary] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem('userUser') || 'null');
  const cartKey = user?.id ? `cart_${user.id}` : 'cart';
  const libraryKey = user?.id ? `library_${user.id}` : 'library';

  const carregarTodosJogos = async () => {
    try {
      const firstRes = await api.get('/jogos?page=1&limit=10');
      const firstPageGames = firstRes.data.jogos || [];
      const total = firstRes.data.totalPages || 1;

      let todos = [...firstPageGames];

      if (total > 1) {
        const requests = [];

        for (let i = 2; i <= total; i++) {
          requests.push(api.get(`/jogos?page=${i}&limit=10`));
        }

        const responses = await Promise.all(requests);

        responses.forEach((res) => {
          todos = [...todos, ...(res.data.jogos || [])];
        });
      }

      setAllGames(todos);
    } catch (err) {
      console.error('Erro ao buscar todos os jogos:', err);
    }
  };

  const carregarJogosPagina = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/jogos?page=${page}&limit=10`);

      setGames(res.data.jogos || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Erro ao buscar jogos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogosPagina();

    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }

    const savedLibrary = localStorage.getItem(libraryKey);
    if (savedLibrary) {
      setLibrary(JSON.parse(savedLibrary));
    } else {
      setLibrary([]);
    }
  }, [page, cartKey, libraryKey]);

  useEffect(() => {
    carregarTodosJogos();
  }, []);

  useEffect(() => {
    const termo = search.trim().toLowerCase();

    if (!termo) {
      setFilteredGames(games);
      return;
    }

    const filtered = allGames.filter((game) =>
      game.titulo.toLowerCase().includes(termo)
    );

    setFilteredGames(filtered);
  }, [search, games, allGames]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userUser');
    navigate('/login');
  };

  const alreadyOwned = (id: number) => {
    return library.some((game) => game.id === id);
  };

  const alreadyInCart = (id: number) => {
    return cart.some((game) => game.id === id);
  };

  const showToast = (message: string) => {
    setToast(message);

    setTimeout(() => {
      setToast('');
    }, 2500);
  };

  const abrirDetalhes = (gameId: number) => {
    navigate(`/jogo/${gameId}`);
  };

  const irParaPagamento = (game: Game) => {
    if (alreadyOwned(game.id)) return;

    if (!game.estoque || game.estoque <= 0) {
      showToast('Produto sem estoque');
      return;
    }

    navigate('/payment', {
      state: { game }
    });
  };

  const addToCart = (game: Game) => {
    if (alreadyOwned(game.id)) return;

    if (alreadyInCart(game.id)) {
      showToast('Esse jogo já está no carrinho');
      return;
    }

    if (!game.estoque || game.estoque <= 0) {
      showToast('Produto sem estoque');
      return;
    }

    const updatedCart = [...cart, game];
    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    showToast(`${game.titulo} adicionado ao carrinho`);
  };

  const buscando = search.trim().length > 0;

  return (
    <div className="store-container">
      <nav className="store-nav">
        <div className="logo" onClick={() => navigate('/store')}>
          PlayHub
        </div>

        <div className="nav-actions">
          <input
            type="text"
            placeholder="Buscar jogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn-secondary" onClick={() => navigate('/library')}>
            Biblioteca
          </button>

          <button className="btn-secondary" onClick={() => navigate('/profile')}>
            Perfil
          </button>

          <button className="cart-nav-button" onClick={() => navigate('/cart')}>
            🛒
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </button>

          {user && <span className="user-name">Olá, {user.nome}</span>}

          <button className="btn-secondary" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>

      <header className="store-header">
        <h1>Loja</h1>
      </header>

      <h2 style={{ paddingLeft: '5%', marginBottom: '30px' }}>
        Jogos 🎮
      </h2>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando jogos...</p>
        </div>
      ) : (
        <>
          <div className="store-grid">
            {filteredGames.map((game) => {
              const owned = alreadyOwned(game.id);

              return (
                <div
                  key={game.id}
                  className="game-shop-card"
                  onClick={() => abrirDetalhes(game.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="img-container">
                    <img
                      src={
                        game.imagem_url ||
                        'https://via.placeholder.com/400x200?text=Game'
                      }
                      alt={game.titulo}
                    />
                  </div>

                  <div className="game-info">
                    <h3>{game.titulo}</h3>

                    <p>{game.descricao}</p>

                    <div className="price-row">
                      <span className="price">
                        {Number(game.preco).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </span>

                      <span className="stock">
                        Estoque: {game.estoque ?? 0}
                      </span>
                    </div>

                    <div className="actions-row">
                      <button
                        className="buy-button"
                        disabled={!game.estoque || owned}
                        onClick={(e) => {
                          e.stopPropagation();
                          irParaPagamento(game);
                        }}
                      >
                        {owned
                          ? 'Já adquirido'
                          : game.estoque === 0
                          ? 'Sem estoque'
                          : 'Comprar'}
                      </button>

                      {!owned && game.estoque !== 0 && (
                        <button
                          className="cart-icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(game);
                          }}
                        >
                          🛒
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!buscando && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Voltar
              </button>

              <span>
                Página {page} de {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Avançar →
              </button>
            </div>
          )}
        </>
      )}

      {toast && <div className="toast-message">{toast}</div>}

       <Footer />
    </div>
  );
}

export default Store;