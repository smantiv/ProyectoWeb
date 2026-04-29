import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { ReasignacionService, TurnoService, DocenteService } from '../services/apiServices';
import { DataTable } from '../components/DataTable';
import { formatDate } from '../utils/helpers';

export const SolicitarReemplazo = () => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    turnoSeleccionado: '',
    profesorSugerido: '',
    motivo: '',
    urgencia: 'NORMAL'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [turnosRes, docentesRes, solicitudesRes] = await Promise.all([
        TurnoService.obtenerTodos(),
        DocenteService.obtenerTodos(),
        ReasignacionService.obtenerTodos()
      ]);
      setTurnos(turnosRes.data || []);
      setDocentes(docentesRes.data || []);
      setSolicitudes(solicitudesRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ReasignacionService.crear({
        turnoId: formData.turnoSeleccionado,
        docenteId: formData.profesorSugerido,
        motivo: formData.motivo,
        urgencia: formData.urgencia
      });
      setFormData({
        turnoSeleccionado: '',
        profesorSugerido: '',
        motivo: '',
        urgencia: 'NORMAL'
      });
      cargarDatos();
    } catch (error) {
      console.error('Error creando solicitud:', error);
    }
  };

  const columns = [
    { key: 'turno', label: 'Turno' },
    { key: 'profesorSugerido', label: 'Profesor sugerido' },
    { key: 'motivo', label: 'Motivo' },
    {
      key: 'urgencia',
      label: 'Urgencia',
      render: (v) => <span className={`badge badge-${v === 'URGENTE' ? 'danger' : 'info'}`}>{v}</span>
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => <span className={`badge badge-${v === 'APROBADO' ? 'success' : v === 'RECHAZADO' ? 'danger' : 'warning'}`}>{v}</span>
    }
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
              <h1>Solicitar Reemplazo de Turno</h1>
              <p>Solicita un reemplazo para alguno de tus turnos asignados.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Nueva Solicitud de Reemplazo</h2>
              <form className="replacement-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Selecciona el turno a reemplazar</label>
                  <select
                    name="turnoSeleccionado"
                    value={formData.turnoSeleccionado}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Elige un turno...</option>
                    {turnos.map(turno => (
                      <option key={turno.id} value={turno.id}>
                        {formatDate(turno.fecha)} - {turno.horaInicio} a {turno.horaFin}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Profesor sugerido para reemplazo</label>
                  <select
                    name="profesorSugerido"
                    value={formData.profesorSugerido}
                    onChange={handleChange}
                  >
                    <option value="">Opcional - sugerir profesor...</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Motivo de la solicitud</label>
                  <textarea
                    name="motivo"
                    placeholder="Explica brevemente por qué necesitas reemplazo..."
                    value={formData.motivo}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nivel de urgencia</label>
                  <div className="urgency-buttons">
                    {['NORMAL', 'URGENTE'].map(level => (
                      <button
                        key={level}
                        type="button"
                        className={`urgency-btn ${formData.urgencia === level ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, urgencia: level })}
                      >
                        {level === 'NORMAL' ? '📋 Normal' : '🚨 Urgente'}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  📤 Enviar Solicitud
                </button>
              </form>
            </section>

            <section className="section">
              <h2 className="subsection-title">Solicitudes Recientes</h2>
              <DataTable
                columns={columns}
                data={solicitudes}
                loading={loading}
                emptyMessage="No hay solicitudes de reemplazo"
              />
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default SolicitarReemplazo;
