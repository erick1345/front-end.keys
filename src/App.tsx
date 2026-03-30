import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Register from './pages/Register';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import DashboardAdmin from './pages/DashboardAdmin';

import AddGame from './pages/AddGame';
import ManageGames from './pages/ManageGames';
import EditGame from './pages/EditGame';

import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/manage-games" element={<ManageGames />} />
          <Route path="/add-game" element={<AddGame />} />
          <Route path="/edit-game/:id" element={<EditGame />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;