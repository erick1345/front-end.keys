import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: number;
  nome: string;
  email: string;
  nivel_acesso: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const adminPaths = [
  '/dashboard-admin',
  '/manage-games',
  '/add-game',
  '/edit-game',
];

function isAdminArea(pathname: string) {
  return adminPaths.some((path) => pathname.startsWith(path));
}

function getSessionByPath() {
  const pathname = window.location.pathname;
  const adminArea = isAdminArea(pathname);

  const storedUser = localStorage.getItem(adminArea ? 'adminUser' : 'userUser');
  const storedToken = localStorage.getItem(adminArea ? 'adminToken' : 'userToken');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialSession = getSessionByPath();

  const [user, setUser] = useState<User | null>(initialSession.user);
  const [token, setToken] = useState<string | null>(initialSession.token);

  useEffect(() => {
    const syncSession = () => {
      const session = getSessionByPath();
      setUser(session.user);
      setToken(session.token);
    };

    syncSession();

    window.addEventListener('storage', syncSession);
    window.addEventListener('focus', syncSession);

    return () => {
      window.removeEventListener('storage', syncSession);
      window.removeEventListener('focus', syncSession);
    };
  }, []);

  const login = (userData: User, tokenData: string) => {
    if (userData.nivel_acesso === 'admin') {
      localStorage.setItem('adminUser', JSON.stringify(userData));
      localStorage.setItem('adminToken', tokenData);
    } else {
      localStorage.setItem('userUser', JSON.stringify(userData));
      localStorage.setItem('userToken', tokenData);
    }

    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    const pathname = window.location.pathname;

    if (isAdminArea(pathname)) {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    } else {
      localStorage.removeItem('userUser');
      localStorage.removeItem('userToken');
    }

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);