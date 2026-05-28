import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sfr_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    function handleForcedLogout() {
      setUser(null);
    }

    window.addEventListener('sfr:logout', handleForcedLogout);
    return () => window.removeEventListener('sfr:logout', handleForcedLogout);
  }, []);

  async function login(email, password) {
    const { token, usuario } = await authService.login({ email, password });
    localStorage.setItem('sfr_token', token);
    localStorage.setItem('sfr_user', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  async function refreshUser() {
    const usuario = await authService.me();
    localStorage.setItem('sfr_user', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  function logout() {
    localStorage.removeItem('sfr_token');
    localStorage.removeItem('sfr_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, refreshUser, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
