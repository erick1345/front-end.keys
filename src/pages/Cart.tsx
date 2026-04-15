import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

interface Game {
  id: number;
  titulo: string;
  preco: number;
  descricao?: string;
  imagem_url?: string;
  estoque?: number;
  plataforma?: string;
}

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Game[]>([]);
  const [toast, setToast] = useState('');

  const user = JSON.parse(localStorage.getItem('userUser') || 'null');
  const cartKey = user?.id ? `cart_${user.id}` : 'cart';

  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, [cartKey]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 2500);
  };

  const removeFromCart = (gameId: number) => {
    const updatedCart = cart.filter((item) => item.id !== gameId);

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    const removedGame = cart.find((item) => item.id === gameId);
    showToast(
      removedGame
        ? `${removedGame.titulo} removido do carrinho`
        : 'Item removido do carrinho'
    );
  };

  const irParaPagamento = () => {
    if (cart.length === 0) {
      showToast('Seu carrinho está vazio');
      return;
    }

    navigate('/payment', {
      state: {
        cartGames: cart,
        fromCart: true
      }
    });
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.preco), 0),
    [cart]
  );

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div>
          <h1>Seu Carrinho 🛒</h1>
          <p>Revise seus jogos antes de finalizar a compra.</p>
        </div>

        <button onClick={() => navigate('/store')}>
          ← Voltar para Loja
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione jogos da loja para continuar.</p>

          <button onClick={() => navigate('/store')}>
            Ir para a Loja
          </button>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map((game) => (
              <div key={game.id} className="cart-card">
                <img
                  src={
                    game.imagem_url ||
                    'https://via.placeholder.com/400x200?text=Game'
                  }
                  alt={game.titulo}
                />

                <div className="cart-info">
                  <div className="cart-top">
                    <div>
                      <h3>{game.titulo}</h3>
                      <span className="cart-platform">
                        {game.plataforma || 'Plataforma não informada'}
                      </span>
                    </div>

                    <span className="cart-price">
                      {Number(game.preco).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>

                  <p className="cart-description">
                    {game.descricao || 'Sem descrição disponível.'}
                  </p>

                  <div className="cart-actions">
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(game.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-info">
              <span>{cart.length} item(ns)</span>
              <strong>
                Total:{' '}
                {total.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </strong>
            </div>

            <button className="checkout-button" onClick={irParaPagamento}>
              Ir para pagamento
            </button>
          </div>
        </>
      )}

      {toast && <div className="toast-message">{toast}</div>}
    </div>
  );
}

export default Cart;