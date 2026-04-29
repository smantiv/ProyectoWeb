import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';
import { DocenteService } from '../services/apiServices';
import { FilterCard, FilterField } from '../components/FilterCard';
import { DataTable } from '../components/DataTable';

export const GestionProfesores = () => {
  const { user } = useAuth();
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    search: '',
    zona: 'Todas',
    estado: 'Todos'
  });

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      setLoading(true);
      const response = await DocenteService.obtenerTodos();
      setDocentes(response.data || []);
    } catch (error) {
      console.error('Error cargando docentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: docentes.length,
    activos: docentes.filter(d => d.activo).length,
    inactivos: docentes.filter(d => !d.activo).length,
    zonasConProfesor: new Set(docentes.map(d => d.zona)).size
  };

  const docentesFiltrados = docentes.filter(d => {
    const matchSearch = d.nombre?.toLowerCase().includes(filtros.search.toLowerCase());
    const matchZona = filtros.zona === 'Todas' || d.zona === filtros.zona;
    const matchEstado = filtros.estado === 'Todos' || (filtros.estado === 'Activos' ? d.activo : !d.activo);
    return matchSearch && matchZona && matchEstado;
  });

  const columns = [
    { key: 'nombre', label: 'Profesor' },
    { key: 'email', label: 'Email' },
    { key: 'zona', label: 'Zona asignada' },
    {
      key: 'activo',
      label: 'Estado',
      render: (value) => (
        <span className={`badge ${value ? 'badge-success' : 'badge-warning'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
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
              <h1>Gestión de Profesores</h1>
              <p>Administra el registro de profesores y sus datos en el sistema.</p>
            </section>

            <button className="btn btn-primary teachers-add-btn">＋ Agregar Profesor</button>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="👥" title="Profesores totales" value={stats.total} trend="↗" trendColor="orange-text" />
                <StatsCard icon="✔" title="Profesores activos" value={stats.activos} trend={`${Math.round((stats.activos/stats.total)*100)}%`} trendColor="green-text" />
                <StatsCard icon="✖" title="Profesores inactivos" value={stats.inactivos} trend={`${Math.round((stats.inactivos/stats.total)*100)}%`} trendColor="red-text" />
                <StatsCard icon="📍" title="Zonas con profesor asignado" value={stats.zonasConProfesor} trend="✔" trendColor="green-text" />
              </div>
            </section>

            <FilterCard>
              <FilterField label="Buscar profesor">
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Nombre o correo..."
                    value={filtros.search}
                    onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
                  />
                </div>
              </FilterField>

              <FilterField label="Zona asignada">
                <select
                  value={filtros.zona}
                  onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}
                >
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>

              <FilterField label="Estado">
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                >
                  <option value="Todos">Todos</option>
                  <option value="Activos">Activos</option>
                  <option value="Inactivos">Inactivos</option>
                </select>
              </FilterField>
            </FilterCard>

            <DataTable
              columns={columns}
              data={docentesFiltrados}
              loading={loading}
              actions={(row) => (
                <div className="table-action-buttons">
                  <button className="btn btn-sm btn-secondary">Editar</button>
                  <button className="btn btn-sm btn-danger">Eliminar</button>
                </div>
              )}
              emptyMessage="No hay profesores registrados"
            />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default GestionProfesores;
