import { useMemo, useState } from 'react';
import { usuariosService } from '../services/resources';
import { AuthContext } from './AuthContextObject';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sfr_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(email) {
    const usuario = await usuariosService.byEmail(email);
    localStorage.setItem('sfr_user', JSON.stringify(usuario));
    setUser(usuario);
    return usuario;
  }

  function quickLogin(role) {
    const usuario = {
      id: null,
      nombre: role === 'ADMIN' ? 'Admin Sistema' : role === 'COORDINADOR' ? 'Coordinador' : 'Docente',
      email: `${role.toLowerCase()}@local`,
      rol: role,
      activo: true,
    };
    localStorage.setItem('sfr_user', JSON.stringify(usuario));
    setUser(usuario);
  }

  function logout() {
    localStorage.removeItem('sfr_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, quickLogin, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
