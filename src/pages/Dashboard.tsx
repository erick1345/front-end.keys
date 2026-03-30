import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    api.get(`/jogos?page=${pagina}&limit=8`).then(res => {
      setJogos(res.data.jogos);
      setTotalPaginas(Math.ceil(res.data.total / 8));
    });
  }, [pagina]);

  return (
    <div style={{ padding: '20px', color: 'white', minHeight: '100vh', background: '#242424' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #444', paddingBottom: '10px' }}>
        <h2>Keys-Forge | Olá, {user?.nome}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/profile')} style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Perfil</button>
          <button onClick={() => navigate('/manage-games')} style={{ background: '#6f42c1', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Gerenciar</button>
          <button onClick={logout} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>
      </header>
      <main style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {jogos.map((jogo: any) => (
          <div key={jogo.id} style={{ background: '#333', padding: '15px', borderRadius: '8px', border: '1px solid #444' }}>
            <img src={jogo.imagem_url} alt={jogo.titulo} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h4>{jogo.titulo}</h4>
            <p style={{ color: '#28a745' }}>R$ {Number(jogo.preco).toFixed(2)}</p>
          </div>
        ))}
      </main>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
        <span>{pagina} / {totalPaginas}</span>
        <button disabled={pagina === totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button>
      </div>
    </div>
  );
};

export default Dashboard;