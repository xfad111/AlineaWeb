import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { validateUser } from '../data/users';

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: () => {},
  isAdmin: () => false,
  getUserDivision: () => '',
  users: [],
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  backupData: () => {},
  restoreData: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const login = async (username: string, password: string): Promise<void> => {
    const user = validateUser(username, password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  const getUserDivision = (): string => {
    return currentUser?.division || '';
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const backupData = () => {
    const data = {
      users,
      reports: localStorage.getItem('reports'),
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alinea-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const restoreData = (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.users) {
        setUsers(parsedData.users);
        localStorage.setItem('users', JSON.stringify(parsedData.users));
      }
      if (parsedData.reports) {
        localStorage.setItem('reports', parsedData.reports);
      }
    } catch (error) {
      console.error('Error restoring data:', error);
      throw new Error('Invalid backup file');
    }
  };

  const contextValue: AuthContextType = {
    currentUser,
    login,
    logout,
    isAdmin,
    getUserDivision,
    users,
    addUser,
    updateUser,
    deleteUser,
    backupData,
    restoreData,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};