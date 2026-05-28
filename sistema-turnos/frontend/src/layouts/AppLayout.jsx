import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, ClipboardList, Contact, Home, LifeBuoy, LogOut, MapPinned, ShieldCheck, Users } from 'lucide-react';
import logo from '../assets/logo-sfr.png';
import { useAuth } from '../context/useAuth';

const links = [
  { to: '/dashboard-admin', label: 'Admin', icon: Home },
  { to: '/dashboard-profesor', label: 'Profesor', icon: ShieldCheck },
  { to: '/dashboard-coordinador', label: 'Coordinador', icon: ClipboardList },
  { to: '/tablero-coordinacion', label: 'Tablero', icon: ClipboardList },
  { to: '/cobertura', label: 'Cobertura', icon: ShieldCheck },
  { to: '/profesores', label: 'Profesores', icon: Users },
  { to: '/turnos', label: 'Turnos', icon: CalendarDays },
  { to: '/zonas', label: 'Zonas', icon: MapPinned },
  { to: '/incidentes', label: 'Incidentes', icon: ClipboardList },
  { to: '/analiticas', label: 'Analiticas', icon: BarChart3 },
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

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
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/soporte"><LifeBuoy size={18} />Soporte</NavLink>
          <NavLink to="/contacto"><Contact size={18} />Contacto</NavLink>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <button type="button" className="back-button" onClick={() => navigate(-1)}>Volver</button>
          <div className="user-chip">
            <span>{user?.nombre || 'Sin sesion'}</span>
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
