import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { StatsCard } from '../components/StatsCard';

export const ReglasOperativas = () => {
  const { user } = useAuth();
  const [reglas, setReglas] = useState([
    { id: 1, nombre: 'Tiempo máximo de alerta', valor: '30 minutos', descripcion: 'Tiempo máximo sin checkpoint antes de alerta' },
    { id: 2, nombre: 'Umbral de cobertura', valor: '90%', descripcion: 'Porcentaje mínimo de cobertura por zona' },
    { id: 3, nombre: 'Escalamiento automático', valor: 'Habilitado', descripcion: 'Escalamiento automático después de 2 alertas' }
  ]);

  const stats = {
    tiempoAlerta: '30 min',
    umbralCobertura: '90%',
    escalamiento: 'Activo',
    cambiosRecientes: 12
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
              <h1>Reglas y Configuración Operativa</h1>
              <p>Gestiona las reglas y parámetros del sistema.</p>
            </section>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="⏱" title="Tiempo máximo de alerta" value={stats.tiempoAlerta} trend="✔" trendColor="blue-text" />
                <StatsCard icon="📊" title="Umbral de cobertura" value={stats.umbralCobertura} trend="✔" trendColor="green-text" />
                <StatsCard icon="🔄" title="Escalamiento" value={stats.escalamiento} trend="✔" trendColor="green-text" />
                <StatsCard icon="📝" title="Cambios recientes" value={stats.cambiosRecientes} trend="↗" trendColor="orange-text" />
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Parámetros Configurables</h2>
              {reglas.map((regla) => (
                <div key={regla.id} className="rule-card">
                  <div className="rule-header">
                    <h3>{regla.nombre}</h3>
                    <button className="btn btn-sm btn-secondary">Editar</button>
                  </div>
                  <p>{regla.descripcion}</p>
                  <p className="rule-value">Valor actual: <strong>{regla.valor}</strong></p>
                </div>
              ))}
            </section>

            <section className="section">
              <h2 className="subsection-title">Historial de Cambios</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="timeline-date">2026-04-15 14:30</span>
                  <p>Umbral de cobertura modificado de 85% a 90%</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">2026-04-14 10:15</span>
                  <p>Tiempo de alerta aumentado a 30 minutos</p>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">2026-04-13 16:45</span>
                  <p>Escalamiento automático habilitado</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default ReglasOperativas;
