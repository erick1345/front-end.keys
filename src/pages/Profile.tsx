import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('userUser') || 'null');

  const [nome, setNome] = useState(user?.nome || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const senhaForte = (valor: string) => {
    return valor.length >= 8 && /\d/.test(valor);
  };

  const salvarPerfil = async () => {
    if (!nome.trim()) {
      showToast('Preencha o nome');
      return;
    }

    if ((senha && !confirmarSenha) || (!senha && confirmarSenha)) {
      showToast('Preencha os dois campos de senha');
      return;
    }

    if (senha && senha !== confirmarSenha) {
      showToast('As senhas não coincidem');
      return;
    }

    if (senha && !senhaForte(senha)) {
      showToast('A senha deve ter no mínimo 8 caracteres e 1 número');
      return;
    }

    try {
      setSaving(true);

      const payload: { nome: string; senha?: string } = {
        nome: nome.trim()
      };

      if (senha) {
        payload.senha = senha;
      }

      const res = await api.put('/users/profile', payload);

      const updatedUser = {
        ...user,
        ...res.data.user
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      showToast('Perfil atualizado com sucesso');

      setSenha('');
      setConfirmarSenha('');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || 'Erro ao atualizar perfil';

      showToast(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Perfil do Usuário 👤</h1>

        <div className="profile-info">
          <label>Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Email</label>
          <input type="text" value={user?.email || ''} disabled />

          <label>CPF</label>
          <input type="text" value={user?.cpf || ''} disabled />

          <label>Nova senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite nova senha"
          />

          <label>Confirmar senha</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme a senha"
          />
        </div>

        <div className="profile-actions">
          <button onClick={salvarPerfil} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>

          <button onClick={() => navigate('/store')}>
            ← Voltar para loja
          </button>
        </div>

        {toast && (
          <div className="toast-message">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;