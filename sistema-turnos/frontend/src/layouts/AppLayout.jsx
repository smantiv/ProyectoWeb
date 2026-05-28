import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, ClipboardList, Contact, Home, LifeBuoy, LogOut, MapPinned, ShieldCheck, Users } from 'lucide-react';
import logo from '../assets/logo-sfr.png';
import { canAccess, homeForRole, ROLE_LABEL } from '../auth/accessControl';
import { useAuth } from '../context/useAuth';

const links = [
  { to: '/dashboard-admin', label: 'Admin', icon: Home, roles: ['ADMIN'] },
  { to: '/dashboard-profesor', label: 'Profesor', icon: ShieldCheck, roles: ['DOCENTE'] },
  { to: '/dashboard-coordinador', label: 'Coordinador', icon: ClipboardList, roles: ['COORDINADOR'] },
  { to: '/tablero-coordinacion', label: 'Tablero', icon: ClipboardList, roles: ['COORDINADOR'] },
  { to: '/cobertura', label: 'Cobertura', icon: ShieldCheck, roles: ['COORDINADOR'] },
  { to: '/profesores', label: 'Profesores', icon: Users, roles: ['ADMIN'] },
  { to: '/turnos', label: 'Turnos', icon: CalendarDays, roles: ['ADMIN', 'COORDINADOR'] },
  { to: '/zonas', label: 'Zonas', icon: MapPinned, roles: ['ADMIN'] },
  { to: '/incidentes', label: 'Incidentes', icon: ClipboardList, roles: ['COORDINADOR', 'ADMIN'] },
  { to: '/analiticas', label: 'Analiticas', icon: BarChart3, roles: ['COORDINADOR', 'ADMIN'] },
];

const profileRoutes = {
  ADMIN: '/mi-perfil',
  DOCENTE: '/mi-perfil-profesor',
  COORDINADOR: '/mi-perfil-coordinador',
};

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const visibleLinks = links.filter((link) => canAccess(user, link.roles));
  const profileRoute = profileRoutes[user?.rol] || homeForRole(user?.rol);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={logo} alt="Logo SFR" />
          <div>
            <strong>Sistema de Vigilancia Escolar</strong>
            <span>Colegio Santa Francisca Romana</span>
          </div>
        </div>
        <nav>
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to={profileRoute}><Users size={18} />Mi perfil</NavLink>
          <NavLink to="/soporte"><LifeBuoy size={18} />Soporte</NavLink>
          <NavLink to="/contacto"><Contact size={18} />Contacto</NavLink>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button type="button" className="back-button" onClick={() => navigate(-1)}>Volver</button>
          <div className="user-chip">
            <span>{user?.nombre || 'Sin sesion'} - {ROLE_LABEL[user?.rol] || user?.rol}</span>
            {user ? <button type="button" onClick={handleLogout}><LogOut size={16} />Salir</button> : null}
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
