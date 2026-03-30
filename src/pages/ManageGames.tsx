import { useEffect, useState } from 'react';
import api from '../services/api';
import NavbarAdmin from '../components/NavbarAdmin';
import './ManageGames.css';

interface Game {
  id: number;
  titulo: string;
  preco: string;
  estoque: number;
  plataforma: string;
  imagem_url: string;
  descricao: string;
}

function ManageGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState('');
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [form, setForm] = useState({
    titulo: '',
    preco: '',
    estoque: '',
    plataforma: '',
    imagem_url: '',
    descricao: '',
  });

  const carregarJogos = async (pagina = 1) => {
    try {
      const res = await api.get(`/games?page=${pagina}&limit=10`);

      setGames(res.data.jogos || []);
      setTotalPaginas(res.data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  };

  useEffect(() => {
    carregarJogos(paginaAtual);
  }, [paginaAtual]);

  const abrirEdicao = (game: Game) => {
    setEditingGame(game);

    setForm({
      titulo: game.titulo,
      preco: game.preco,
      estoque: String(game.estoque),
      plataforma: game.plataforma,
      imagem_url: game.imagem_url,
      descricao: game.descricao,
    });
  };

  const salvarEdicao = async () => {
    if (!editingGame) return;

    try {
      await api.put(`/games/${editingGame.id}`, form);
      setEditingGame(null);
      carregarJogos(paginaAtual);
    } catch (error) {
      console.error('Erro ao editar jogo:', error);
    }
  };

  const excluirJogo = async (id: number) => {
    try {
      await api.delete(`/games/${id}`);
      carregarJogos(paginaAtual);
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const jogosFiltrados = games.filter((game) =>
    game.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <NavbarAdmin />

      <div className="manage-games">
        <h1>🎮 Gerenciar Jogos</h1>

        <input
          type="text"
          placeholder="Buscar jogo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="games-grid">
          {jogosFiltrados.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.imagem_url} alt={game.titulo} />

              <h3>{game.titulo}</h3>
              <p>🎮 {game.plataforma}</p>
              <p>💰 R$ {game.preco}</p>
              <p>📦 Estoque: {game.estoque}</p>

              <div className="actions">
                <button onClick={() => abrirEdicao(game)}>Editar</button>
                <button onClick={() => excluirJogo(game.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => {
              if (paginaAtual > 1) {
                setPaginaAtual(paginaAtual - 1);
              }
            }}
            disabled={paginaAtual === 1}
          >
            ← Voltar
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => {
              if (paginaAtual < totalPaginas) {
                setPaginaAtual(paginaAtual + 1);
              }
            }}
            disabled={paginaAtual >= totalPaginas}
          >
            Avançar →
          </button>
        </div>

        {editingGame && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Editar Jogo</h2>

              <input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />

              <input
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
              />

              <input
                value={form.estoque}
                onChange={(e) => setForm({ ...form, estoque: e.target.value })}
              />

              <input
                value={form.plataforma}
                onChange={(e) =>
                  setForm({ ...form, plataforma: e.target.value })
                }
              />

              <input
                value={form.imagem_url}
                onChange={(e) =>
                  setForm({ ...form, imagem_url: e.target.value })
                }
              />

              <textarea
                value={form.descricao}
                onChange={(e) =>
                  setForm({ ...form, descricao: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button onClick={salvarEdicao}>Salvar</button>
                <button onClick={() => setEditingGame(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageGames;