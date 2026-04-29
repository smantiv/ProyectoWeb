import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { COMMON_NAV_ITEMS, NAV_ITEMS, ROLE_HOME } from '../config/navigation'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const role = user?.rol?.toLowerCase() || 'profesor'
  const navItems = NAV_ITEMS[role] || []

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getAvatarClass = () => {
    if (!user) return 'profile-avatar'
    const currentRole = user.rol?.toLowerCase() || 'usuario'
    if (currentRole === 'admin') return 'profile-avatar profile-avatar-admin'
    return 'profile-avatar'
  }

  const getAvatarLabel = () => {
    const nombre = user?.nombre || 'Usuario'
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }

  return (
    <div className="topbar">
      <div className="brand brand-stack">
        <Link className="brand" to={ROLE_HOME[role] || '/'}>
          <img src="/assets/logo-sfr.png" alt="SFR Logo" className="brand-logo" />
          <span className="brand-title small-text">Sistema de Vigilancia Escolar</span>
        </Link>
        <div className="topbar-links">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`topbar-link ${location.pathname === item.to ? 'topbar-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          {COMMON_NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`topbar-link topbar-link-muted ${location.pathname === item.to ? 'topbar-link-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="profile-box">
          <div className={getAvatarClass()}>{getAvatarLabel()}</div>
          <div>
            <div style={{ fontWeight: '600' }}>{user.nombre || 'Usuario'}</div>
            <div className="small-text" style={{ color: 'var(--text-soft)' }}>
              {user.rol || 'Rol'}
            </div>
          </div>
          <button onClick={handleLogout} className="btn-primary small-btn">
            Salir
          </button>
        </div>
      )}
    </div>
  )
}
