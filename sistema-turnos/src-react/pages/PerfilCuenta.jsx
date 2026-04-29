import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';

export const PerfilCuenta = () => {
  const { user, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || 'Admin Patricia Flores',
    email: user?.email || 'admin@test.com',
    rol: user?.rol || 'ADMIN',
    activo: true,
    fechaCreacion: '2025-01-15'
  });
  const [passwordChange, setPasswordChange] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const activityLog = [
    { fecha: '2026-04-15 14:30', accion: 'Inicio de sesión' },
    { fecha: '2026-04-15 10:15', accion: 'Modificación de regla operativa' },
    { fecha: '2026-04-14 16:45', accion: 'Aprobación de reconocimiento' },
    { fecha: '2026-04-14 12:20', accion: 'Creación de turno' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange({ ...passwordChange, [name]: value });
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    // API call would go here
  };

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
              <h1>Perfil de Cuenta</h1>
              <p>Administra tu información personal y configuración.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Información Personal</h2>
              <div className="profile-card">
                <div className="profile-card-header">
                  <div className="profile-avatar-large profile-avatar-admin">👤</div>
                  <div className="profile-info">
                    <h3>{profileData.nombre}</h3>
                    <p className="profile-role">
                      <span className="role-badge">Admin</span>
                    </p>
                  </div>
                  <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancelar' : 'Editar perfil'}
                  </button>
                </div>

                {editMode ? (
                  <div className="profile-edit-form">
                    <div className="form-group">
                      <label>Nombre completo</label>
                      <input type="text" name="nombre" value={profileData.nombre} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={profileData.email} onChange={handleChange} />
                    </div>
                    <button className="btn btn-primary" onClick={handleSaveProfile}>
                      ✔ Guardar cambios
                    </button>
                  </div>
                ) : (
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
                      <span className="profile-label">Estado</span>
                      <p>{profileData.activo ? 'Activo' : 'Inactivo'}</p>
                    </div>
                    <div className="profile-info-item">
                      <span className="profile-label">Miembro desde</span>
                      <p>{profileData.fechaCreacion}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Seguridad</h2>

              <div className="security-section">
                <h3>Cambiar contraseña</h3>
                <div className="password-form">
                  <div className="form-group">
                    <label>Contraseña actual</label>
                    <input type="password" name="actual" value={passwordChange.actual} onChange={handlePasswordChange} />
                  </div>
                  <div className="form-group">
                    <label>Nueva contraseña</label>
                    <input type="password" name="nueva" value={passwordChange.nueva} onChange={handlePasswordChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirmar nueva contraseña</label>
                    <input type="password" name="confirmar" value={passwordChange.confirmar} onChange={handlePasswordChange} />
                  </div>
                  <button className="btn btn-primary">🔐 Actualizar contraseña</button>
                </div>
              </div>

              <div className="security-section">
                <h3>Autenticación de dos factores</h3>
                <div className="twofa-toggle">
                  <p>Agrega una capa extra de seguridad a tu cuenta</p>
                  <button
                    className={`btn ${twoFactorEnabled ? 'btn-danger' : 'btn-primary'}`}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    {twoFactorEnabled ? '✖ Deshabilitar 2FA' : '✔ Habilitar 2FA'}
                  </button>
                </div>
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
              <h2 className="subsection-title">Sesión</h2>
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

export default PerfilCuenta;
