import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { IUser } from '@shared/globalTypes';

interface AuthContextData {
  user: IUser | null;
  authenticated: boolean;
  login: (userData: IUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@KeysForge:user');
    const storagedToken = localStorage.getItem('@KeysForge:token');

    if (storagedUser && storagedToken) {
      try {
        setUser(JSON.parse(storagedUser));
      } catch (error) {
        console.error('Erro ao converter usuário do localStorage:', error);
        localStorage.removeItem('@KeysForge:user');
        localStorage.removeItem('@KeysForge:token');
      }
    }
  }, []);

  const login = (userData: IUser, token: string) => {
    if (!userData || !token) {
      console.error('Dados inválidos no login');
      return;
    }

    setUser(userData);
    localStorage.setItem('@KeysForge:user', JSON.stringify(userData));
    localStorage.setItem('@KeysForge:token', token);
  };

  const logout = () => {
    localStorage.removeItem('@KeysForge:user');
    localStorage.removeItem('@KeysForge:token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated: !!user,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);