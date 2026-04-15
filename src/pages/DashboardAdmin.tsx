import { useEffect, useState } from 'react';
import api from '../services/api';
import NavbarAdmin from '../components/NavbarAdmin';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './DashboardAdmin.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

interface JogoResumo {
  id: number;
  titulo: string;
  preco?: number | string;
  estoque: number;
}

interface SalesItem {
  gameId?: number;
  titulo: string;
  vendas?: number;
  totalSales?: number;
  totalRevenue?: number;
}

interface DashboardData {
  totalJogos: number;
  valorEstoque: number;
  estoqueBaixo: number;
  ultimosJogos: JogoResumo[];
  estoqueGrafico: JogoResumo[];
}

interface SalesData {
  totalVendas?: number;
  totalValor?: number;
  totalSales?: number;
  totalRevenue?: number;
  topGames: SalesItem[];
}

function DashboardAdmin() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [sales, setSales] = useState<SalesData | null>(null);
  const [erro, setErro] = useState('');

  const carregar = async () => {
    const res = await api.get('/dashboard/admin');
    setDados(res.data);
  };

  const carregarSales = async () => {
    const res = await api.get('/dashboard/sales');
    setSales(res.data);
  };

  useEffect(() => {
    const carregarTudo = async () => {
      try {
        setErro('');
        await Promise.all([carregar(), carregarSales()]);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setErro('Não foi possível carregar os dados do dashboard.');
      }
    };

    carregarTudo();

    const interval = setInterval(carregarTudo, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!dados) {
    return (
      <>
        <NavbarAdmin />
        <div className="dashboard-admin">
          <p>{erro || 'Carregando...'}</p>
        </div>
      </>
    );
  }

  const estoqueChartData = {
    labels: dados.estoqueGrafico.map((j) => j.titulo),
    datasets: [
      {
        label: 'Estoque',
        data: dados.estoqueGrafico.map((j) => Number(j.estoque) || 0),
        backgroundColor: '#38bdf8',
        borderRadius: 6
      }
    ]
  };

  const salesChartData = {
    labels: sales?.topGames?.map((g) => g.titulo) || [],
    datasets: [
      {
        label: 'Vendas',
        data:
          sales?.topGames?.map((g) =>
            Number(g.totalSales ?? g.vendas ?? 0)
          ) || [],
        backgroundColor: '#22c55e',
        borderRadius: 6
      }
    ]
  };

  const totalVendas = Number(
    sales?.totalSales ?? sales?.totalVendas ?? 0
  );

  const totalValor = Number(
    sales?.totalRevenue ?? sales?.totalValor ?? 0
  );

  const hasSales = (sales?.topGames?.length || 0) > 0;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
          maxRotation: 35,
          minRotation: 35
        },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#cbd5e1',
          precision: 0
        },
        grid: { color: 'rgba(255,255,255,0.05)' }
      }
    }
  };

  return (
    <>
      <NavbarAdmin />

      <div className="dashboard-admin">
        <h1>📊 Dashboard Admin</h1>

        {erro && <p className="dashboard-error">{erro}</p>}

        <div className="dashboard-cards">
          <div className="card">
            <h3>Total Jogos</h3>
            <p>{dados.totalJogos}</p>
          </div>

          <div className="card">
            <h3>Valor Estoque</h3>
            <p>
              {Number(dados.valorEstoque).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </div>

          <div className="card alert">
            <h3>Estoque Baixo</h3>
            <p>{dados.estoqueBaixo}</p>
          </div>
        </div>

        <div
          className="dashboard-grid"
          style={{ gridTemplateColumns: '1fr' }}
        >
          <div className="chart">
            <h2>📈 10 Jogos com Menor Estoque</h2>
            <div className="chart-box">
              <Bar data={estoqueChartData} options={chartOptions} />
            </div>
          </div>

          <div className="chart">
            <h2>💰 Últimas 10 Compras</h2>

            {hasSales ? (
              <>
                <div className="chart-box">
                  <Bar data={salesChartData} options={chartOptions} />
                </div>

                <div className="sales-total-box">
                  <div>
                    <span className="sales-total-label">Total de vendas</span>
                    <strong className="sales-total-value">
                      {totalVendas}
                    </strong>
                  </div>

                  <div className="sales-total-right">
                    <span className="sales-total-label">Faturamento</span>
                    <strong className="sales-total-value">
                      {totalValor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>Nenhuma venda registrada ainda.</p>

                <div className="sales-total-box">
                  <div>
                    <span className="sales-total-label">Total de vendas</span>
                    <strong className="sales-total-value">0</strong>
                  </div>

                  <div className="sales-total-right">
                    <span className="sales-total-label">Faturamento</span>
                    <strong className="sales-total-value">
                      {Number(0).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="dashboard-grid"
          style={{ gridTemplateColumns: '1fr' }}
        >
          <div className="dashboard-list">
            <h2>📦 Últimos Jogos</h2>

            <div className="table-header">
              <span>Jogo</span>
              <span>Preço</span>
              <span>Estoque</span>
            </div>

            {dados.ultimosJogos.map((j) => (
              <div key={j.id} className="game-item">
                <span>{j.titulo}</span>
                <span>
                  {Number(j.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </span>
                <span>{j.estoque}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;