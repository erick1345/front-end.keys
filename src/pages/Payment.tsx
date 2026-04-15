import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Payment.css';

interface Game {
  id: number;
  titulo: string;
  preco: number;
  descricao?: string;
  imagem_url?: string;
  estoque?: number;
  plataforma?: string;
}

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const game = location.state?.game as Game | undefined;
  const cartGames = (location.state?.cartGames as Game[] | undefined) || [];
  const fromCart = Boolean(location.state?.fromCart);

  const jogos = fromCart ? cartGames : game ? [game] : [];

  const [metodo, setMetodo] = useState<'cartao' | 'pix'>('cartao');
  const [nomeCartao, setNomeCartao] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const user = JSON.parse(localStorage.getItem('userUser') || 'null');
  const libraryKey = user?.id ? `library_${user.id}` : 'library';
  const cartKey = user?.id ? `cart_${user.id}` : 'cart';

  const total = useMemo(
    () => jogos.reduce((sum, item) => sum + Number(item.preco), 0),
    [jogos]
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const finalizarPagamento = async () => {
    if (jogos.length === 0) {
      showToast('Nenhum jogo encontrado para pagamento');
      return;
    }

    if (metodo === 'cartao') {
      if (!nomeCartao || !numeroCartao || !validade || !cvv) {
        showToast('Preencha os dados do cartão');
        return;
      }
    }

    try {
      setLoading(true);

      const resultados = await Promise.all(
        jogos.map((item) =>
          api.post('/purchase', {
            gameId: item.id
          })
        )
      );

      if (resultados.length !== jogos.length) {
        throw new Error('Nem todas as compras foram concluídas');
      }

      try {
        const response = await api.get('/users/library');
        const library = Array.isArray(response.data) ? response.data : [];
        localStorage.setItem(libraryKey, JSON.stringify(library));
      } catch {
        const libraryStorage = localStorage.getItem(libraryKey);
        const library = libraryStorage ? JSON.parse(libraryStorage) : [];
        const updatedLibrary = [...library];

        jogos.forEach((item) => {
          const alreadyOwned = updatedLibrary.some((g: Game) => g.id === item.id);

          if (!alreadyOwned) {
            updatedLibrary.push(item);
          }
        });

        localStorage.setItem(libraryKey, JSON.stringify(updatedLibrary));
      }

      if (fromCart) {
        localStorage.removeItem(cartKey);
      }

      showToast('Pagamento realizado com sucesso');

      setTimeout(() => {
        navigate('/library');
      }, 1200);
    } catch (err: any) {
      console.error('Erro ao finalizar pagamento:', err);
      showToast(err?.response?.data?.message || 'Erro ao realizar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (jogos.length === 0) {
    return (
      <div className="payment-page">
        <nav className="payment-nav">
          <div className="payment-logo" onClick={() => navigate('/store')}>
            PlayHub Store
          </div>
        </nav>

        <div className="payment-empty-state">
          <h1>Pagamento</h1>
          <p>Nenhum jogo encontrado.</p>
          <button className="payment-back-btn" onClick={() => navigate('/store')}>
            Voltar para Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <nav className="payment-nav">
        <div className="payment-logo" onClick={() => navigate('/store')}>
          PlayHub Store
        </div>

        <div className="payment-nav-actions">
          <button className="payment-back-btn" onClick={() => navigate(-1)}>
            Voltar
          </button>
        </div>
      </nav>

      <div className="payment-wrapper">
        <section className="payment-card">
          <h2 className="payment-section-title">Resumo do pedido</h2>

          <div className="payment-items">
            {jogos.map((item) => (
              <div key={item.id} className="payment-item">
                <img
                  src={
                    item.imagem_url ||
                    'https://via.placeholder.com/400x200?text=Game'
                  }
                  alt={item.titulo}
                  className="payment-item-image"
                />

                <div className="payment-item-info">
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao || 'Sem descrição disponível.'}</p>
                  <span className="payment-item-platform">
                    {item.plataforma || 'PC'}
                  </span>
                </div>

                <strong className="payment-item-price">
                  {Number(item.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </strong>
              </div>
            ))}
          </div>

          <div className="payment-summary">
            <span>{jogos.length} item(ns)</span>

            <strong>
              Total:{' '}
              {total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </strong>
          </div>
        </section>

        <section className="payment-card">
          <h2 className="payment-section-title">Forma de pagamento</h2>

          <div className="payment-methods">
            <button
              className={`payment-method-btn ${metodo === 'cartao' ? 'active' : ''}`}
              onClick={() => setMetodo('cartao')}
              type="button"
            >
              Cartão
            </button>

            <button
              className={`payment-method-btn ${metodo === 'pix' ? 'active' : ''}`}
              onClick={() => setMetodo('pix')}
              type="button"
            >
              Pix
            </button>
          </div>

          {metodo === 'cartao' ? (
            <div className="payment-form">
              <div className="payment-input-group">
                <label>Nome no cartão</label>
                <input
                  type="text"
                  placeholder="Digite o nome impresso no cartão"
                  value={nomeCartao}
                  onChange={(e) => setNomeCartao(e.target.value)}
                />
              </div>

              <div className="payment-input-group">
                <label>Número do cartão</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={numeroCartao}
                  onChange={(e) => setNumeroCartao(e.target.value)}
                />
              </div>

              <div className="payment-form-row">
                <div className="payment-input-group">
                  <label>Validade</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                  />
                </div>

                <div className="payment-input-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>

              <div className="payment-security-box">
                <span className="payment-security-icon">🔒</span>
                <p>Seus dados são tratados de forma segura nesta simulação de compra.</p>
              </div>
            </div>
          ) : (
            <div className="payment-pix-box">
              <div className="payment-pix-icon">💠</div>
              <h3>Pagamento via Pix</h3>
              <p>
                Ao confirmar, a compra será processada imediatamente e o jogo
                será adicionado à sua biblioteca.
              </p>

              <div className="payment-pix-code">
                PIX-PlayHub-2026
              </div>

              <span className="payment-pix-tip">
                Faz o pix.
              </span>
            </div>
          )}

          <button
            className="payment-confirm-btn"
            onClick={finalizarPagamento}
            disabled={loading}
            type="button"
          >
            {loading ? 'Processando...' : 'Confirmar pagamento'}
          </button>
        </section>
      </div>

      {toast && <div className="payment-toast">{toast}</div>}
    </div>
  );
}

export default Payment;