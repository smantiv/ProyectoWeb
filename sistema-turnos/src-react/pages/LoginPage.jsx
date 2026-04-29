import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(usuario, contrasena)
      if (result.success) {
        const role = result.user.rol?.toLowerCase()
        if (role === 'profesor') {
          navigate('/dashboard-profesor')
        } else if (role === 'coordinador') {
          navigate('/dashboard-coordinador')
        } else if (role === 'admin') {
          navigate('/dashboard-admin')
        } else {
          navigate('/dashboard-profesor')
        }
      } else {
        setError(result.error || 'No fue posible iniciar sesion.')
      }
    } catch (err) {
      setError('Ocurrio un error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const usarAccesoRapido = (rol) => {
    setUsuario(rol)
    setContrasena('1234')
    setError('')
  }

  return (
    <div className="page">
      <div className="main-center">
        <div className="login-header">
          <div className="hero-logo-wrap">
            <img src="/assets/logo-sfr.png" alt="SFR" className="hero-logo" />
          </div>
          <h1>Sistema de Gestion de Turnos</h1>
          <p>SPA de vigilancia escolar conectada a servicios REST.</p>
        </div>

        <div className="card login-card">
          <h2>Iniciar sesion</h2>
          <form onSubmit={handleSubmit} className="form-stack">
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'var(--red)',
                  color: 'white',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="field">
              <label>Usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin, profesor o coordinador"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label>Contrasena</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="1234"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-large btn-full" disabled={loading}>
              {loading ? 'Iniciando...' : 'Entrar'}
            </button>
          </form>

          <div className="center-link">
            <a href="#help">Usa la clave de demo `1234`.</a>
          </div>
        </div>

        <div className="quick-access">
          <p className="quick-access-title">Acceso rapido por rol</p>
          <div className="role-grid">
            <div className="role-card role-profesor" onClick={() => usarAccesoRapido('profesor')}>
              <span className="role-icon-circle">PROF</span>
              <span>Profesor</span>
            </div>
            <div className="role-card role-coordinador" onClick={() => usarAccesoRapido('coordinador')}>
              <span className="role-icon-circle">COOR</span>
              <span>Coordinador</span>
            </div>
            <div className="role-card role-admin" onClick={() => usarAccesoRapido('admin')}>
              <span className="role-icon-circle">ADMIN</span>
              <span>Administrador</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>
          <span className="footer-school">Sistema de Vigilancia Escolar</span>
        </p>
        <div className="footer-links">
          <a href="#help">Ayuda</a>
          <span>•</span>
          <a href="#terms">Terminos</a>
          <span>•</span>
          <a href="#privacy">Privacidad</a>
        </div>
      </div>
    </div>
  )
}
