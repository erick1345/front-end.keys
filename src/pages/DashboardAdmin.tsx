import { useEffect, useState } from 'react';
import api from '../services/api';
import NavbarAdmin from '../components/NavbarAdmin';
import './DashboardAdmin.css';

interface Game {
  id: number;
  titulo: string;
  preco: string;
  estoque: number;
  descricao: string;
  plataforma: string;
  imagem_url: string;
}

function DashboardAdmin() {
  const [jogos, setJogos] = useState<Game[]>([]);
  const [totalJogos, setTotalJogos] = useState(0);
  const [loading, setLoading] = useState(false);

  const carregarJogos = async () => {
    try {
      setLoading(true);

      const res = await api.get('/games');

      const lista = Array.isArray(res.data.jogos) ? res.data.jogos : [];

      setJogos(lista);
      setTotalJogos(res.data.total || lista.length);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarJogos();
  }, []);

  const valorEstoque = jogos.reduce((acc, jogo) => {
    return acc + parseFloat(jogo.preco) * jogo.estoque;
  }, 0);

  const estoqueBaixo = jogos.filter((jogo) => jogo.estoque <= 5).length;

  return (
    <>
      <NavbarAdmin />

      <div className="dashboard-admin">
        <h1>📊 Dashboard Admin</h1>

        {loading && <p>Carregando dados...</p>}

        <div className="dashboard-cards">
          <div className="card">
            <h3>🎮 Total Jogos</h3>
            <p>{totalJogos}</p>
          </div>

          <div className="card">
            <h3>💰 Valor Estoque</h3>
            <p>R$ {valorEstoque.toFixed(2)}</p>
          </div>

          <div className="card">
            <h3>⚠ Estoque Baixo</h3>
            <p>{estoqueBaixo}</p>
          </div>
        </div>

        <div className="dashboard-list">
          <h2>📦 Últimos Jogos</h2>

          <div className="table-header">
            <span>Jogo</span>
            <span>Preço</span>
            <span>Estoque</span>
          </div>

          {jogos.map((jogo) => (
            <div key={jogo.id} className="game-item">
              <span>{jogo.titulo}</span>
              <span>R$ {jogo.preco}</span>
              <span>{jogo.estoque}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;