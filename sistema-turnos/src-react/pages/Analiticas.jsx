import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';
import { FilterCard, FilterField } from '../components/FilterCard';

export const Analiticas = () => {
  const { user } = useAuth();
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    zona: 'Todas',
    tipoIncidente: 'Todos'
  });

  const stats = {
    incidentesTotal: 156,
    incidentesSemana: 12,
    resolucionPromedio: '85%',
    tiempoPromedio: '2.3 horas'
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
              <h1>Analíticas y Estadísticas</h1>
              <p>Análisis detallado del desempeño del sistema.</p>
            </section>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="📊" title="Incidentes totales" value={stats.incidentesTotal} trend="↗" trendColor="orange-text" />
                <StatsCard icon="📈" title="Incidentes esta semana" value={stats.incidentesSemana} trend="↓" trendColor="green-text" />
                <StatsCard icon="✔" title="Tasa de resolución" value={stats.resolucionPromedio} trend="↗" trendColor="green-text" />
                <StatsCard icon="⏱" title="Tiempo promedio resolución" value={stats.tiempoPromedio} trend="↓" trendColor="green-text" />
              </div>
            </section>

            <FilterCard title="Filtros de Análisis">
              <FilterField label="Fecha de inicio">
                <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })} />
              </FilterField>

              <FilterField label="Fecha de fin">
                <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} />
              </FilterField>

              <FilterField label="Zona">
                <select value={filtros.zona} onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>

              <FilterField label="Tipo de incidente">
                <select value={filtros.tipoIncidente} onChange={(e) => setFiltros({ ...filtros, tipoIncidente: e.target.value })}>
                  <option value="Todos">Todos</option>
                  <option value="PELEA">Pelea</option>
                  <option value="ACCIDENTE">Accidente</option>
                  <option value="ROBO">Robo</option>
                </select>
              </FilterField>
            </FilterCard>

            <section className="section">
              <h2 className="subsection-title">Análisis Visual</h2>
              <div className="analytics-grid">
                <div className="analytics-chart">
                  <h3>Incidentes por Tipo</h3>
                  <div className="chart-placeholder">
                    <p>[Gráfico de incidentes por tipo]</p>
                  </div>
                </div>
                <div className="analytics-chart">
                  <h3>Tendencias Semanales</h3>
                  <div className="chart-placeholder">
                    <p>[Gráfico de tendencias]</p>
                  </div>
                </div>
                <div className="analytics-chart">
                  <h3>Tasa de Resolución</h3>
                  <div className="chart-placeholder">
                    <p>[Gráfico de resolución]</p>
                  </div>
                </div>
                <div className="analytics-chart">
                  <h3>Incidentes por Zona</h3>
                  <div className="chart-placeholder">
                    <p>[Gráfico de zonas]</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default Analiticas;
