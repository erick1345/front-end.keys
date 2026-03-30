import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';

const EditGame: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', preco: '', plataforma: '', imagem_url: '', estoque: ''
  });

  useEffect(() => {
    api.get(`/jogos/${id}`)
      .then(res => setFormData(res.data))
      .catch(() => alert('Erro ao carregar dados do jogo'));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/jogos/${id}`, formData);
      alert('Jogo atualizado com sucesso!');
      navigate('/manage-games');
    } catch (err) {
      alert('Erro ao atualizar jogo');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', color: 'white', background: '#333', padding: '30px', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Editar Jogo #{id}</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Título" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} required />
        <Input label="Descrição" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
        <Input label="Preço" type="number" step="0.01" value={formData.preco} onChange={e => setFormData({...formData, preco: e.target.value})} required />
        <Input label="Plataforma" value={formData.plataforma} onChange={e => setFormData({...formData, plataforma: e.target.value})} required />
        <Input label="URL da Imagem" value={formData.imagem_url} onChange={e => setFormData({...formData, imagem_url: e.target.value})} required />
        <Input label="Estoque" type="number" value={formData.estoque} onChange={e => setFormData({...formData, estoque: e.target.value})} required />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar Alterações
          </button>
          <button type="button" onClick={() => navigate('/manage-games')} style={{ flex: 1, padding: '12px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGame;