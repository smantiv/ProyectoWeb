import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { IncidenteService } from '../services/apiServices';

export const ReportarIncidente = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipoIncidente: 'PELEA',
    ubicacion: '',
    prioridad: 'MEDIA',
    descripcion: '',
    evidencia: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const turnoActual = {
    zona: 'Patio Principal',
    horaInicio: '14:00',
    estado: 'Activo'
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files?.[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await IncidenteService.crear({
        tipo: formData.tipoIncidente,
        ubicacion: formData.ubicacion,
        prioridad: formData.prioridad,
        descripcion: formData.descripcion
      });
      setSuccess(true);
      setFormData({
        tipoIncidente: 'PELEA',
        ubicacion: '',
        prioridad: 'MEDIA',
        descripcion: '',
        evidencia: null
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error reportando incidente:', error);
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
              <h1>Reportar Incidente</h1>
              <p>Reporta un incidente ocurrido durante tu turno de vigilancia.</p>
            </section>

            {success && (
              <div className="checkpoint-confirmation">
                <span className="confirmation-icon">✔</span>
                <p>Incidente reportado exitosamente.</p>
              </div>
            )}

            <section className="section">
              <h2 className="subsection-title">Información del Turno</h2>
              <div className="checkpoint-summary-card">
                <div className="checkpoint-summary-grid checkpoint-summary-grid-3">
                  <div className="checkpoint-summary-item">
                    <div className="checkpoint-summary-label">
                      <span className="checkpoint-mini-icon">📍</span>
                      <span>Zona</span>
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
                      <span className="checkpoint-mini-icon">✔</span>
                      <span>Estado</span>
                    </div>
                    <span className="checkpoint-status-badge">Activo</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Reportar Incidente</h2>
              <form className="incident-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tipo de incidente</label>
                  <select name="tipoIncidente" value={formData.tipoIncidente} onChange={handleChange} required>
                    <option value="PELEA">Pelea</option>
                    <option value="ACCIDENTE">Accidente</option>
                    <option value="ROBO">Robo</option>
                    <option value="COMPORTAMIENTO">Comportamiento inapropiado</option>
                    <option value="OTRO">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Ubicación específica</label>
                  <select name="ubicacion" value={formData.ubicacion} onChange={handleChange} required>
                    <option value="">Selecciona ubicación...</option>
                    <option value="Entrada principal">Entrada principal</option>
                    <option value="Patio">Patio</option>
                    <option value="Pasillo bloque A">Pasillo bloque A</option>
                    <option value="Zona deportiva">Zona deportiva</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nivel de prioridad</label>
                  <div className="priority-buttons">
                    {['BAJA', 'MEDIA', 'ALTA'].map(priority => (
                      <button
                        key={priority}
                        type="button"
                        className={`priority-btn ${formData.prioridad === priority ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, prioridad: priority })}
                      >
                        {priority === 'BAJA' ? '🟢 Baja' : priority === 'MEDIA' ? '🟡 Media' : '🔴 Alta'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción del incidente</label>
                  <textarea
                    name="descripcion"
                    placeholder="Describe detalladamente lo sucedido..."
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adjuntar evidencia (opcional)</label>
                  <input type="file" name="evidencia" onChange={handleChange} accept="image/*,video/*" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : '📤 Enviar Reporte'}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default ReportarIncidente;
