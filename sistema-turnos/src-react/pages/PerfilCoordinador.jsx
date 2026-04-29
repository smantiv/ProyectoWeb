import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';

export const PerfilCoordinador = () => {
  const { user, logout } = useAuth();
  const [profileData] = useState({
    nombre: user?.nombre || 'Coordinador Juan López',
    email: user?.email || 'coordinador@test.com',
    rol: 'COORDINADOR',
    zonasSupervisa: ['Zona A', 'Zona B'],
    fechaInicio: '2025-02-10'
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const activityLog = [
    { fecha: '2026-04-15 14:30', accion: 'Revisión de cobertura tiempo real' },
    { fecha: '2026-04-15 10:15', accion: 'Gestión de incidente' },
    { fecha: '2026-04-14 16:45', accion: 'Revisión de reportes' },
    { fecha: '2026-04-14 12:20', accion: 'Inicio de sesión' }
  ];

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="mis-turnos-main">
          <div className="back-wrap">
            <button className="back-btn" onClick={() => window.history.back()} title="Volver">←</button>
          </div>

          <div className="container">
            <section className="section-header">
              <h1>Perfil Coordinador</h1>
              <p>Tu información de perfil y configuración.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Información de Perfil</h2>
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar-large">👤</div>
                  <div className="profile-info">
                    <h3>{profileData.nombre}</h3>
                    <p className="profile-role">
                      <span className="role-badge">Coordinador</span>
                    </p>
                  </div>
                </div>

                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <span className="profile-label">Email</span>
                    <p>{profileData.email}</p>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Rol</span>
                    <p>{profileData.rol}</p>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Zonas supervisadas</span>
                    <p>{profileData.zonasSupervisa.join(', ')}</p>
                  </div>
                  <div className="profile-info-item">
                    <span className="profile-label">Miembro desde</span>
                    <p>{profileData.fechaInicio}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Configuración de Seguridad</h2>
              <div className="security-section">
                <h3>Cambiar contraseña</h3>
                <button className="btn btn-secondary" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                  {showPasswordForm ? 'Cancelar' : '🔐 Cambiar contraseña'}
                </button>
                {showPasswordForm && (
                  <div className="password-form">
                    <div className="form-group">
                      <label>Contraseña actual</label>
                      <input type="password" placeholder="●●●●●●●●" />
                    </div>
                    <div className="form-group">
                      <label>Nueva contraseña</label>
                      <input type="password" placeholder="●●●●●●●●" />
                    </div>
                    <button className="btn btn-primary">✔ Actualizar</button>
                  </div>
                )}
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Historial de Actividad</h2>
              <div className="activity-list">
                {activityLog.map((log, idx) => (
                  <div key={idx} className="activity-item">
                    <span className="activity-time">{log.fecha}</span>
                    <p>{log.accion}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <button className="btn btn-danger" onClick={logout}>
                🚪 Cerrar sesión
              </button>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default PerfilCoordinador;
