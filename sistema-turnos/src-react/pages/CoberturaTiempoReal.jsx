import React, { useEffect, useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import NavBar from '../components/NavBar'
import StatsCard from '../components/StatsCard'
import DataTable from '../components/DataTable'
import { ZonaService } from '../services/apiServices'

export const CoberturaTiempoReal = () => {
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarZonas = async () => {
      try {
        setLoading(true)
        const response = await ZonaService.obtenerTodos()
        setZonas(response.data || [])
      } catch (error) {
        console.error('Error cargando zonas:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarZonas()
  }, [])

  const stats = {
    zonasCubiertas: zonas.filter((zona) => zona.cobertura === 'COMPLETA').length,
    zonasSinCobertura: zonas.filter((zona) => zona.cobertura !== 'COMPLETA').length,
    turnosActivos: zonas.filter((zona) => zona.turnoActivo).length,
    alertas: zonas.filter((zona) => zona.cobertura !== 'COMPLETA').length,
  }

  const columns = [
    { key: 'nombre', label: 'Zona' },
    { key: 'profesorAsignado', label: 'Profesor asignado' },
    {
      key: 'cobertura',
      label: 'Estado cobertura',
      render: (value) => (
        <span className={`badge badge-${value === 'COMPLETA' ? 'success' : 'warning'}`}>{value}</span>
      ),
    },
    { key: 'ultimoCheckpoint', label: 'Ultimo checkpoint' },
  ]

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="mis-turnos-main">
          <div className="back-wrap">
            <button className="back-btn" onClick={() => window.history.back()} title="Volver">
              Volver
            </button>
          </div>

          <div className="container">
            <section className="section-header">
              <h1>Cobertura en tiempo real</h1>
              <p>Resumen de zonas y cobertura calculada desde el backend REST.</p>
            </section>

            <section className="section">
              <div className="admin-stats-grid">
                <StatsCard icon="OK" title="Zonas cubiertas" value={stats.zonasCubiertas} trend="Estable" trendColor="green-text" />
                <StatsCard icon="ALR" title="Zonas sin cobertura" value={stats.zonasSinCobertura} trend="Revisar" trendColor="red-text" />
                <StatsCard icon="ACT" title="Turnos activos" value={stats.turnosActivos} trend="Actual" trendColor="blue-text" />
                <StatsCard icon="OBS" title="Alertas activas" value={stats.alertas} trend="Atencion" trendColor="orange-text" />
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Mapa de cobertura</h2>
              <div className="coverage-map">
                {zonas.map((zona) => (
                  <div key={zona.id} className={`coverage-cell coverage-${zona.cobertura === 'COMPLETA' ? 'active' : 'inactive'}`}>
                    <p>{zona.nombre}</p>
                    <p className="coverage-status">{zona.cobertura}</p>
                  </div>
                ))}
              </div>
            </section>

            <DataTable columns={columns} data={zonas} loading={loading} emptyMessage="No hay zonas disponibles" />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  )
}

export default CoberturaTiempoReal
