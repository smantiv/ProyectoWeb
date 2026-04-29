import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';
import { ZonaService } from '../services/apiServices';
import { FilterCard, FilterField } from '../components/FilterCard';
import { DataTable } from '../components/DataTable';

export const GestionZonas = () => {
  const { user } = useAuth();
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    search: '',
    cobertura: 'Todas'
  });

  useEffect(() => {
    cargarZonas();
  }, []);

  const cargarZonas = async () => {
    try {
      setLoading(true);
      const response = await ZonaService.obtenerTodos();
      setZonas(response.data || []);
    } catch (error) {
      console.error('Error cargando zonas:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: zonas.length,
    conCobertura: zonas.filter(z => z.cobertura === 'COMPLETA').length,
    sinCobertura: zonas.filter(z => z.cobertura === 'INCOMPLETA').length,
    conProfesor: zonas.filter(z => z.profesorAsignado).length
  };

  const zonasFiltradas = zonas.filter(z => {
    const matchSearch = z.nombre?.toLowerCase().includes(filtros.search.toLowerCase());
    return matchSearch;
  });

  const columns = [
    { key: 'nombre', label: 'Zona' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'profesorAsignado', label: 'Responsable' },
    {
      key: 'cobertura',
      label: 'Cobertura',
      render: (v) => <span className={`badge badge-${v === 'COMPLETA' ? 'success' : 'warning'}`}>{v}</span>
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
              <h1>Gestión de Zonas</h1>
              <p>Administra las zonas de vigilancia escolar.</p>
            </section>

            <button className="btn btn-primary teachers-add-btn">＋ Agregar Zona</button>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="📍" title="Zonas totales" value={stats.total} trend="↗" />
                <StatsCard icon="✔" title="Con cobertura" value={stats.conCobertura} trend={`${Math.round((stats.conCobertura/stats.total)*100)}%`} trendColor="green-text" />
                <StatsCard icon="⚠" title="Sin cobertura completa" value={stats.sinCobertura} trend="!" trendColor="orange-text" />
                <StatsCard icon="👥" title="Con profesor asignado" value={stats.conProfesor} trend="✔" trendColor="green-text" />
              </div>
            </section>

            <FilterCard>
              <FilterField label="Buscar zona">
                <div className="search-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Nombre de zona..."
                    value={filtros.search}
                    onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
                  />
                </div>
              </FilterField>
            </FilterCard>

            <DataTable
              columns={columns}
              data={zonasFiltradas}
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

export default GestionZonas;
