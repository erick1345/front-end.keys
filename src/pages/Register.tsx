import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', email: '', cpf: '', senha: '', confirmarSenha: '' });
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmarSenha) return setError('As senhas não conferem');

    try {
      await api.post('/usuarios', formData);
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (err: any) {
      // Exibe a mensagem específica do Backend
      const mensagem = err.response?.data?.message || 'Erro ao realizar cadastro';
      setError(mensagem);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', color: 'white' }}>
      <h1>Criar Conta</h1>
      {error && <p style={{ color: '#ff4444', fontWeight: 'bold' }}>{error}</p>}
      <form onSubmit={handleRegister} style={{ background: '#333', padding: '20px', borderRadius: '8px' }}>
        <Input label="Nome Completo" onChange={e => setFormData({...formData, nome: e.target.value})} required />
        <Input label="E-mail" type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <Input label="CPF" onChange={e => setFormData({...formData, cpf: e.target.value})} required />
        <Input label="Senha" type="password" onChange={e => setFormData({...formData, senha: e.target.value})} required />
        <Input label="Confirmar Senha" type="password" onChange={e => setFormData({...formData, confirmarSenha: e.target.value})} required />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default Register;