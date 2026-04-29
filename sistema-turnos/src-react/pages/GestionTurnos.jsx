import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';
import { TurnoService } from '../services/apiServices';
import { FilterCard, FilterField } from '../components/FilterCard';
import { DataTable } from '../components/DataTable';
import { formatDate } from '../utils/helpers';

export const GestionTurnos = () => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha: '',
    zona: 'Todas',
    profesor: '',
    estado: 'Todos'
  });

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      setLoading(true);
      const response = await TurnoService.obtenerTodos();
      setTurnos(response.data || []);
    } catch (error) {
      console.error('Error cargando turnos:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: turnos.length,
    programados: turnos.filter(t => t.estado === 'PENDIENTE').length,
    enCurso: turnos.filter(t => t.estado === 'ACTIVO').length,
    completados: turnos.filter(t => t.estado === 'COMPLETADO').length
  };

  const turnosFiltrados = turnos.filter(t => {
    const matchFecha = !filtros.fecha || formatDate(t.fecha).includes(filtros.fecha);
    const matchZona = filtros.zona === 'Todas' || t.zona === filtros.zona;
    const matchEstado = filtros.estado === 'Todos' || t.estado === filtros.estado;
    return matchFecha && matchZona && matchEstado;
  });

  const columns = [
    { key: 'fecha', label: 'Fecha', render: (v) => formatDate(v) },
    { key: 'horaInicio', label: 'Horario', render: (v, row) => `${v} - ${row.horaFin}` },
    { key: 'zona', label: 'Zona' },
    { key: 'profesor', label: 'Profesor asignado' },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => <span className={`badge badge-${v === 'COMPLETADO' ? 'success' : v === 'ACTIVO' ? 'info' : 'warning'}`}>{v}</span>
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
              <h1>Gestión de Turnos</h1>
              <p>Programa y organiza los turnos de vigilancia escolar.</p>
            </section>

            <button className="btn btn-primary teachers-add-btn">＋ Programar Turno</button>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="🕒" title="Turnos totales" value={stats.total} trend="↗" />
                <StatsCard icon="📅" title="Turnos programados" value={stats.programados} trend={`${Math.round((stats.programados/stats.total)*100)}%`} trendColor="blue-text" />
                <StatsCard icon="↻" title="Turnos en curso" value={stats.enCurso} trend="!" trendColor="orange-text" />
                <StatsCard icon="✔" title="Turnos completados" value={stats.completados} trend={`${Math.round((stats.completados/stats.total)*100)}%`} trendColor="green-text" />
              </div>
            </section>

            <FilterCard>
              <FilterField label="Fecha">
                <input type="date" value={filtros.fecha} onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} />
              </FilterField>

              <FilterField label="Zona">
                <select value={filtros.zona} onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>

              <FilterField label="Estado">
                <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                  <option value="Todos">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="COMPLETADO">Completado</option>
                </select>
              </FilterField>
            </FilterCard>

            <DataTable
              columns={columns}
              data={turnosFiltrados}
              loading={loading}
              actions={(row) => (
                <div className="table-action-buttons">
                  <button className="btn btn-sm btn-secondary">Editar</button>
                  <button className="btn btn-sm btn-danger">Eliminar</button>
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default GestionTurnos;
