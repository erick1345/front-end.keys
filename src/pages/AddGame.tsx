import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';

const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', preco: '', plataforma: '', imagem_url: '', estoque: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // envia os dados para a rota /jogos 
      await api.post('/jogos', formData);
      alert('Jogo adicionado com sucesso ao Keys-Forge!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Erro ao cadastrar jogo:", err.response?.data);
      alert('Erro ao cadastrar: ' + (err.response?.data?.message || 'Verifique o terminal do VS Code'));
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', color: 'white' }}>
      <h2>Cadastrar Nova Key</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Título" onChange={e => setFormData({...formData, titulo: e.target.value})} required />
        <Input label="Descrição" onChange={e => setFormData({...formData, descricao: e.target.value})} required />
        <Input label="Preço" type="number" step="0.01" onChange={e => setFormData({...formData, preco: e.target.value})} required />
        <Input label="Plataforma" onChange={e => setFormData({...formData, plataforma: e.target.value})} required />
        <Input label="URL da Imagem" onChange={e => setFormData({...formData, imagem_url: e.target.value})} required />
        <Input label="Estoque" type="number" onChange={e => setFormData({...formData, estoque: e.target.value})} required />
        
        <button type="submit" style={{ 
          width: '100%', padding: '12px', background: '#28a745', color: 'white', 
          border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' 
        }}>
          Salvar Jogo
        </button>
      </form>
    </div>
  );
};

export default AddGame;