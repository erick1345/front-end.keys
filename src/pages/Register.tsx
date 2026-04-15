import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (valor: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const validarCpf = (valor: string) => {
    const cleanCpf = valor.replace(/\D/g, '');

    if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) {
      return false;
    }

    let sum = 0;
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCpf[i - 1]) * (11 - i);
    }

    let rev = (sum * 10) % 11;
    rev = rev === 10 || rev === 11 ? 0 : rev;

    if (rev !== parseInt(cleanCpf[9])) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCpf[i - 1]) * (12 - i);
    }

    rev = (sum * 10) % 11;
    rev = rev === 10 || rev === 11 ? 0 : rev;

    return rev === parseInt(cleanCpf[10]);
  };

  const validarSenhaForte = (valor: string) => {
    return valor.length >= 8 && /\d/.test(valor);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !cpf || !senha || !confirmarSenha) {
      alert('Preencha todos os campos.');
      return;
    }

    if (!validarEmail(email)) {
      alert('Digite um e-mail válido.');
      return;
    }

    if (!validarCpf(cpf)) {
      alert('Digite um CPF válido.');
      return;
    }

    if (!validarSenhaForte(senha)) {
      alert('A senha deve ter no mínimo 8 caracteres e 1 número.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/register', {
        nome,
        email,
        cpf: cpf.replace(/\D/g, ''),
        senha
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Erro ao cadastrar usuário.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '60px auto',
        padding: '30px',
        background: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        color: 'white'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#38bdf8',
          marginBottom: '20px'
        }}
      >
        Criar conta
      </h1>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nome"
          type="text"
          autoComplete="name"
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="CPF"
          type="text"
          autoComplete="off"
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="new-password"
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Input
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          onChange={(e) => setConfirmarSenha(e.target.value)}
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
            marginTop: '10px'
          }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Já tem conta?{' '}
        <Link
          to="/login"
          style={{
            color: '#38bdf8',
            textDecoration: 'none'
          }}
        >
          Entrar
        </Link>
      </p>
    </div>
  );
};

export default Register;