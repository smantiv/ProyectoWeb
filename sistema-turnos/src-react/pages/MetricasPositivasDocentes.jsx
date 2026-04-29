import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';
import { DocenteService } from '../services/apiServices';
import { FilterCard, FilterField } from '../components/FilterCard';
import { DataTable } from '../components/DataTable';

export const MetricasPositivasDocentes = () => {
  const { user } = useAuth();
  const [docentes, setDocentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    profesor: '',
    zona: 'Todas',
    rango: 'mes'
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
    promedioPuntualidad: '96.5%',
    incidentesEvitados: 23,
    satisfaccion: '4.8/5.0',
    topPerformers: docentes.filter(d => d.calificacion >= 4.5).length
  };

  const topDocentes = docentes.sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0)).slice(0, 5);

  const columns = [
    { key: 'nombre', label: 'Profesor' },
    { key: 'zona', label: 'Zona' },
    { key: 'turnosCompletados', label: 'Turnos completados' },
    { key: 'incidentes', label: 'Incidentes reportados' },
    { key: 'puntualidad', label: 'Puntualidad' },
    {
      key: 'calificacion',
      label: 'Calificación',
      render: (v) => <span className="calificacion-badge">{v?.toFixed(1)}/5.0</span>
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
              <h1>Métricas Positivas de Docentes</h1>
              <p>Desempeño excepcional de profesores en vigilancia.</p>
            </section>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="✔" title="Puntualidad promedio" value={stats.promedioPuntualidad} trend="↗" trendColor="green-text" />
                <StatsCard icon="🛡" title="Incidentes evitados" value={stats.incidentesEvitados} trend="↗" trendColor="green-text" />
                <StatsCard icon="⭐" title="Satisfacción promedio" value={stats.satisfaccion} trend="✔" trendColor="green-text" />
                <StatsCard icon="🏆" title="Top performers" value={stats.topPerformers} trend="↗" trendColor="green-text" />
              </div>
            </section>

            <FilterCard title="Filtros">
              <FilterField label="Profesor">
                <input type="text" placeholder="Buscar profesor..." value={filtros.profesor} onChange={(e) => setFiltros({ ...filtros, profesor: e.target.value })} />
              </FilterField>

              <FilterField label="Zona">
                <select value={filtros.zona} onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>

              <FilterField label="Rango">
                <select value={filtros.rango} onChange={(e) => setFiltros({ ...filtros, rango: e.target.value })}>
                  <option value="semana">Esta semana</option>
                  <option value="mes">Este mes</option>
                  <option value="trimestre">Este trimestre</option>
                  <option value="año">Este año</option>
                </select>
              </FilterField>
            </FilterCard>

            <section className="section">
              <h2 className="subsection-title">Top 5 Mejores Desempeños</h2>
              <div className="top-performers-grid">
                {topDocentes.map((docente, idx) => (
                  <div key={docente.id} className="performer-card">
                    <div className="performer-rank">#{idx + 1}</div>
                    <h3>{docente.nombre}</h3>
                    <p className="performer-zone">{docente.zona}</p>
                    <p className="performer-rating">⭐ {docente.calificacion?.toFixed(1)}/5.0</p>
                  </div>
                ))}
              </div>
            </section>

            <DataTable
              columns={columns}
              data={docentes}
              loading={loading}
              actions={(row) => (
                <button className="btn btn-sm btn-secondary">Ver detalles</button>
              )}
            />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default MetricasPositivasDocentes;
