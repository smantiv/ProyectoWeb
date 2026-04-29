import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { IncidenteService } from '../services/apiServices';
import { FilterCard, FilterField } from '../components/FilterCard';
import { DataTable } from '../components/DataTable';
import { formatDate } from '../utils/helpers';

export const GestionIncidentes = () => {
  const { user } = useAuth();
  const [incidentes, setIncidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    estado: 'Todos',
    prioridad: 'Todas',
    zona: 'Todas'
  });

  useEffect(() => {
    cargarIncidentes();
  }, []);

  const cargarIncidentes = async () => {
    try {
      setLoading(true);
      const response = await IncidenteService.obtenerTodos();
      setIncidentes(response.data || []);
    } catch (error) {
      console.error('Error cargando incidentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const incidentesFiltrados = incidentes.filter(i => {
    const matchEstado = filtros.estado === 'Todos' || i.estado === filtros.estado;
    const matchPrioridad = filtros.prioridad === 'Todas' || i.prioridad === filtros.prioridad;
    const matchZona = filtros.zona === 'Todas' || i.zona === filtros.zona;
    return matchEstado && matchPrioridad && matchZona;
  });

  const columns = [
    { key: 'tipo', label: 'Tipo de incidente' },
    { key: 'ubicacion', label: 'Ubicación' },
    { key: 'fechaHora', label: 'Fecha y hora', render: (v) => formatDate(v) },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (v) => <span className={`badge badge-${v === 'ALTA' ? 'danger' : v === 'MEDIA' ? 'warning' : 'info'}`}>{v}</span>
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => <span className={`badge badge-${v === 'RESUELTO' ? 'success' : 'warning'}`}>{v}</span>
    },
    { key: 'responsable', label: 'Responsable' }
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
              <h1>Gestión de Incidentes</h1>
              <p>Monitorea y gestiona todos los incidentes reportados.</p>
            </section>

            <FilterCard>
              <FilterField label="Estado">
                <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                  <option value="Todos">Todos</option>
                  <option value="ABIERTO">Abierto</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="RESUELTO">Resuelto</option>
                </select>
              </FilterField>

              <FilterField label="Prioridad">
                <select value={filtros.prioridad} onChange={(e) => setFiltros({ ...filtros, prioridad: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </FilterField>

              <FilterField label="Zona">
                <select value={filtros.zona} onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>
            </FilterCard>

            <DataTable
              columns={columns}
              data={incidentesFiltrados}
              loading={loading}
              actions={(row) => (
                <div className="table-action-buttons">
                  <button className="btn btn-sm btn-secondary">Ver detalles</button>
                  <button className="btn btn-sm btn-primary">Actualizar</button>
                </div>
              )}
            />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default GestionIncidentes;
