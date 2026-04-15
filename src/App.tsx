import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Store from './pages/Store';
import Cart from './pages/Cart';
import DashboardAdmin from './pages/DashboardAdmin';
import ManageGames from './pages/ManageGames';
import AddGame from './pages/AddGame';
import EditGame from './pages/EditGame';
import Profile from './pages/Profile';
import Library from './pages/Library';
import Payment from './pages/Payment';
import GameDetails from './pages/GameDetails';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redireciona raiz para login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jogo/:id" element={<GameDetails />} />

          {/* Rotas protegidas */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />

          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <Store />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage-games"
            element={
              <ProtectedRoute>
                <ManageGames />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-game"
            element={
              <ProtectedRoute>
                <AddGame />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-game/:id"
            element={
              <ProtectedRoute>
                <EditGame />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;