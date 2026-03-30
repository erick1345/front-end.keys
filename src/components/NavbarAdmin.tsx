import { Link, useNavigate } from 'react-router-dom';
import './NavbarAdmin.css';

function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar-admin">
      <div className="navbar-admin-logo">
        🎮 Admin Painel
      </div>

      <div className="navbar-admin-links">
        <Link to="/dashboard-admin">
          <button>📊 Dashboard</button>
        </Link>

        <Link to="/manage-games">
          <button>🎮 Jogos</button>
        </Link>

        <Link to="/add-game">
          <button>➕ Novo Jogo</button>
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}

export default NavbarAdmin;