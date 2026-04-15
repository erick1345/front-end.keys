import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ManageGames.css';

const AddGame: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    plataforma: '',
    imagem_url: '',
    estoque: '',
    requisitos_minimos: '',
    requisitos_recomendados: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        preco: Number(formData.preco),
        estoque: Number(formData.estoque)
      };

      await api.post('/jogos', payload);

      alert('Jogo adicionado com sucesso ao Keys-Forge!');
      navigate('/manage-games');
    } catch (err: any) {
      console.error('Erro ao cadastrar jogo:', err.response?.data);

      alert(
        'Erro ao cadastrar: ' +
          (err.response?.data?.message || 'Verifique o terminal do VS Code')
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal form-modal">
        <div className="modal-header">
          <div>
            <h2>➕ Novo Jogo</h2>
            <p>Cadastre um novo jogo na plataforma</p>
          </div>

          <button
            className="modal-close"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            type="button"
          >
            ←
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="titulo">Nome do jogo</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: GTA V"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco">Preço</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                placeholder="Ex: 199.90"
                value={formData.preco}
                onChange={(e) =>
                  setFormData({ ...formData, preco: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estoque">Estoque</label>
              <input
                id="estoque"
                type="number"
                placeholder="Ex: 10"
                value={formData.estoque}
                onChange={(e) =>
                  setFormData({ ...formData, estoque: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="plataforma">Plataforma</label>
              <input
                id="plataforma"
                type="text"
                placeholder="Ex: PC, PS5, Xbox"
                value={formData.plataforma}
                onChange={(e) =>
                  setFormData({ ...formData, plataforma: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="imagem_url">URL da imagem</label>
              <input
                id="imagem_url"
                type="text"
                placeholder="Cole aqui o link da capa do jogo"
                value={formData.imagem_url}
                onChange={(e) =>
                  setFormData({ ...formData, imagem_url: e.target.value })
                }
                required
              />

              {formData.imagem_url && (
                <div className="image-preview">
                  <img
                    src={formData.imagem_url}
                    alt="Preview"
                    onError={(e: any) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                placeholder="Descreva o jogo..."
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="requisitos_minimos">Requisitos mínimos</label>
              <textarea
                id="requisitos_minimos"
                placeholder="Ex: Windows 10 / i5 / 8 GB RAM / GTX 1050 Ti"
                value={formData.requisitos_minimos}
                onChange={(e) =>
                  setFormData({ ...formData, requisitos_minimos: e.target.value })
                }
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="requisitos_recomendados">Requisitos recomendados</label>
              <textarea
                id="requisitos_recomendados"
                placeholder="Ex: Windows 11 / i7 / 16 GB RAM / RTX 3060"
                value={formData.requisitos_recomendados}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requisitos_recomendados: e.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGame;