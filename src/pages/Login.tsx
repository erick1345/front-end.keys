import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Input from '../components/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, senha });
      // armazena o token no localstorage via context
      login(response.data.usuario, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('E-mail ou senha inválidos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit}>
        <Input label="E-mail" type="email" onChange={e => setEmail(e.target.value)} required />
        <Input label="Senha" type="password" onChange={e => setSenha(e.target.value)} required />
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Acessar Keys Forge
        </button>
      </form>
    </div>
  );
};

export default Login;