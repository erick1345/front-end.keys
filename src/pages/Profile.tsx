import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '' });

  useEffect(() => {
    if (user?.id) {
      api.get(`/usuarios/${user.id}`).then(res => setFormData(res.data));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${user?.id}`, { nome: formData.nome, cpf: formData.cpf });
      alert('Perfil atualizado com sucesso!');
      
      const updatedUser = { ...user!, nome: formData.nome, cpf: formData.cpf };
      const token = localStorage.getItem('@KeysForge:token') || '';
      login(updatedUser, token);
      
      navigate('/dashboard');
    } catch (err: any) {
      // Pega a mensagem vinda do Backend (ex: "CPF inválido!")
      const mensagem = err.response?.data?.message || 'Erro ao atualizar perfil';
      alert(mensagem); 
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', color: 'white', background: '#333', padding: '30px', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px' }}>Meu Perfil</h2>
      <form onSubmit={handleSubmit}>
        <Input label="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
        <Input label="E-mail" value={formData.email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
        <Input label="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} required />
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '12px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;