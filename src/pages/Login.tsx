import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Input from '../components/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email,
        senha,
      });

      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error('Resposta inválida do servidor');
      }

      login(user, token);

      alert('Login realizado com sucesso!');

      if (user.nivel_acesso === 'admin') {
        navigate('/dashboard-admin');
      } else {
        navigate('/store');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Erro ao conectar com o servidor.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '30px',
        background: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        color: 'white',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#38bdf8',
        }}
      >
        PlayHub
      </h1>

      <form onSubmit={handleSubmit}>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#38bdf8',
            color: '#0f172a',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Ainda não tem conta?{' '}
        <Link
          to="/register"
          style={{
            color: '#38bdf8',
            textDecoration: 'none',
          }}
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default Login;
