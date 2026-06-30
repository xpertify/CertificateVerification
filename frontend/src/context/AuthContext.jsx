import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    institutionId: null,
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');
    const institutionId = sessionStorage.getItem('institutionId');
    if (token && role) {
      setAuth({ token, role, institutionId: institutionId || null });
    }
  }, []);

  function login(data) {
    const { token, role, institutionId } = data;
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('role', role);
    if (institutionId) sessionStorage.setItem('institutionId', institutionId);
    setAuth({ token, role, institutionId: institutionId || null });
  }

  function logout() {
    sessionStorage.clear();
    setAuth({ token: null, role: null, institutionId: null });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
