import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { CheckpointService } from '../services/apiServices';

export const RegistrarPunto = () => {
  const { user } = useAuth();
  const [pinCode, setPinCode] = useState('');
  const [notas, setNotas] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const turnoActual = {
    zona: 'Patio Principal',
    horaInicio: '14:00',
    horaActual: '14:35',
    estado: 'Activo'
  };

  const handleRegistrarPunto = async () => {
    try {
      setLoading(true);
      await CheckpointService.crear({
        pin: pinCode,
        notas: notas,
        zona: turnoActual.zona
      });
      setShowConfirmation(true);
      setPinCode('');
      setNotas('');
      setTimeout(() => setShowConfirmation(false), 3000);
    } catch (error) {
      console.error('Error registrando checkpoint:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="mis-turnos-main">
          <div className="back-wrap">
            <button className="back-btn" onClick={() => window.history.back()} title="Volver">←</button>
          </div>

          <div className="checkpoint-container">
            <section className="section-header">
              <h1>Registrar Punto de Control</h1>
              <p>Confirma tu ubicación registrando el checkpoint del punto de vigilancia.</p>
            </section>

            {showConfirmation && (
              <div className="checkpoint-confirmation">
                <span className="confirmation-icon">✔</span>
                <p>Checkpoint registrado exitosamente.</p>
              </div>
            )}

            <section className="section">
              <h2 className="subsection-title">Turno Activo</h2>

              <div className="checkpoint-summary-card">
                <div className="checkpoint-summary-grid checkpoint-summary-grid-4">
                  <div className="checkpoint-summary-item">
                    <div className="checkpoint-summary-label">
                      <span className="checkpoint-mini-icon">📍</span>
                      <span>Zona asignada</span>
                    </div>
                    <p>{turnoActual.zona}</p>
                  </div>

                  <div className="checkpoint-summary-item">
                    <div className="checkpoint-summary-label">
                      <span className="checkpoint-mini-icon">🕒</span>
                      <span>Hora de inicio</span>
                    </div>
                    <p>{turnoActual.horaInicio}</p>
                  </div>

                  <div className="checkpoint-summary-item">
                    <div className="checkpoint-summary-label">
                      <span className="checkpoint-mini-icon">🕒</span>
                      <span>Hora actual</span>
                    </div>
                    <p>{turnoActual.horaActual}</p>
                  </div>

                  <div className="checkpoint-summary-item">
                    <div className="checkpoint-summary-label">
                      <span className="checkpoint-mini-icon">✔</span>
                      <span>Estado del turno</span>
                    </div>
                    <span className="checkpoint-status-badge">Activo</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Registrar Checkpoint</h2>
              <form className="checkpoint-form">
                <div className="form-group">
                  <label>Ingresa el PIN (6 dígitos)</label>
                  <input
                    type="password"
                    maxLength="6"
                    placeholder="000000"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    className="pin-input"
                  />
                </div>

                <div className="form-group">
                  <label>Notas adicionales (opcional)</label>
                  <textarea
                    placeholder="Agrega observaciones..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows="3"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRegistrarPunto}
                  disabled={pinCode.length !== 6 || loading}
                >
                  {loading ? 'Registrando...' : '✔ Registrar Punto de Control'}
                </button>
              </form>
            </section>

            <section className="section">
              <h2 className="subsection-title">Últimos Checkpoints Registrados</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Zona</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>14:30</td>
                    <td>Patio Principal</td>
                    <td><span className="badge badge-success">Registrado</span></td>
                  </tr>
                  <tr>
                    <td>14:15</td>
                    <td>Patio Principal</td>
                    <td><span className="badge badge-success">Registrado</span></td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default RegistrarPunto;
