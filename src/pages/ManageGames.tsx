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
  requisitos_minimos?: string;
  requisitos_recomendados?: string;
}

function ManageGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
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
    requisitos_minimos: '',
    requisitos_recomendados: ''
  });

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
    } catch (error) {
      console.error('Erro ao carregar todos os jogos:', error);
    }
  };

  const carregarJogos = async (pagina = 1) => {
    try {
      const res = await api.get(`/jogos?page=${pagina}&limit=10`);
      setGames(res.data.jogos || []);
      setTotalPaginas(res.data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  };

  useEffect(() => {
    carregarJogos(paginaAtual);
  }, [paginaAtual]);

  useEffect(() => {
    carregarTodosJogos();
  }, []);

  const abrirEdicao = (game: Game) => {
    setEditingGame(game);
    setForm({
      titulo: game.titulo,
      preco: game.preco,
      estoque: String(game.estoque),
      plataforma: game.plataforma,
      imagem_url: game.imagem_url,
      descricao: game.descricao,
      requisitos_minimos: game.requisitos_minimos || '',
      requisitos_recomendados: game.requisitos_recomendados || ''
    });
  };

  const fecharEdicao = () => {
    setEditingGame(null);
  };

  const salvarEdicao = async () => {
    if (!editingGame) return;

    try {
      await api.put(`/jogos/${editingGame.id}`, {
        ...form,
        estoque: Number(form.estoque),
        preco: String(form.preco)
      });

      alert('Jogo atualizado com sucesso ✅');
      setEditingGame(null);

      await Promise.all([carregarJogos(paginaAtual), carregarTodosJogos()]);
    } catch (error) {
      console.error('Erro ao editar jogo:', error);
      alert('Erro ao salvar');
    }
  };

  const excluirJogo = async (id: number) => {
    const confirmar = confirm('Deseja excluir este jogo?');
    if (!confirmar) return;

    try {
      await api.delete(`/jogos/${id}`);
      alert('Jogo removido com sucesso 🗑');
      await Promise.all([carregarJogos(paginaAtual), carregarTodosJogos()]);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir');
    }
  };

  const buscando = search.trim().length > 0;

  const jogosFiltrados = (buscando ? allGames : games).filter((game) =>
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

        {!buscando && (
          <div className="pagination">
            <button
              onClick={() => setPaginaAtual((prev) => prev - 1)}
              disabled={paginaAtual === 1}
            >
              ← Voltar
            </button>

            <span>
              Página {paginaAtual} de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaAtual((prev) => prev + 1)}
              disabled={paginaAtual >= totalPaginas}
            >
              Avançar →
            </button>
          </div>
        )}

        {editingGame && (
          <div className="modal-overlay" onClick={fecharEdicao}>
            <div className="modal edit-game-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>Editar Jogo</h2>
                  <p>Atualize as informações do jogo selecionado.</p>
                </div>

                <button
                  className="modal-close"
                  onClick={fecharEdicao}
                  aria-label="Fechar modal"
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="titulo">Nome do jogo</label>
                  <input
                    id="titulo"
                    type="text"
                    placeholder="Ex: Sekiro"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="preco">Preço</label>
                  <input
                    id="preco"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 259.99"
                    value={form.preco}
                    onChange={(e) => setForm({ ...form, preco: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estoque">Estoque</label>
                  <input
                    id="estoque"
                    type="number"
                    placeholder="Ex: 20"
                    value={form.estoque}
                    onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="plataforma">Plataforma</label>
                  <input
                    id="plataforma"
                    type="text"
                    placeholder="Ex: PC, PS5, Xbox"
                    value={form.plataforma}
                    onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="imagem_url">URL da imagem</label>
                  <input
                    id="imagem_url"
                    type="text"
                    placeholder="Cole aqui o link da capa do jogo"
                    value={form.imagem_url}
                    onChange={(e) => setForm({ ...form, imagem_url: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="descricao">Descrição</label>
                  <textarea
                    id="descricao"
                    placeholder="Descreva o jogo..."
                    value={form.descricao}
                    onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="requisitos_minimos">Requisitos mínimos</label>
                  <textarea
                    id="requisitos_minimos"
                    placeholder="Ex: Windows 10 / i5 / 8 GB RAM / GTX 1050 Ti"
                    value={form.requisitos_minimos}
                    onChange={(e) =>
                      setForm({ ...form, requisitos_minimos: e.target.value })
                    }
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="requisitos_recomendados">Requisitos recomendados</label>
                  <textarea
                    id="requisitos_recomendados"
                    placeholder="Ex: Windows 11 / i7 / 16 GB RAM / RTX 3060"
                    value={form.requisitos_recomendados}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        requisitos_recomendados: e.target.value
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-buttons">
                <button onClick={salvarEdicao}>Salvar</button>
                <button onClick={fecharEdicao} type="button">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageGames;