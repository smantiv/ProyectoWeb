import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import NavBar from '../components/NavBar'
import ProtectedLayout from '../components/ProtectedLayout'
import { DocenteService, IncidenteService, TurnoService } from '../services/apiServices'

export default function DashboardCoordinador() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTurnos: 0,
    profesores: 0,
    incidentes: 0,
    completados: 0,
  })
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [turnosRes, docentesRes, incidentesRes] = await Promise.all([
          TurnoService.obtenerTodos(),
          DocenteService.obtenerTodos(),
          IncidenteService.obtenerTodos(),
        ])

        const turnosCargados = turnosRes.data || []
        setTurnos(turnosCargados)
        setStats({
          totalTurnos: turnosCargados.length,
          profesores: (docentesRes.data || []).length,
          incidentes: (incidentesRes.data || []).length,
          completados: turnosCargados.filter((turno) => turno.estado === 'COMPLETADO').length,
        })
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <div className="container">
          <section className="section">
            <h1>Panel de coordinacion</h1>
            <p>Vista operativa para {user?.nombre || 'coordinacion'}.</p>
          </section>

          <section className="section">
            <h2>Indicadores</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Total de turnos</span>
                  <span className="admin-trend orange-text">TURNOS</span>
                </div>
                <h3>{stats.totalTurnos}</h3>
                <p>Registrados</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Profesores</span>
                  <span className="admin-trend green">DOC</span>
                </div>
                <h3>{stats.profesores}</h3>
                <p>Disponibles</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Incidentes</span>
                  <span className="admin-trend red">INC</span>
                </div>
                <h3>{stats.incidentes}</h3>
                <p>Reportados</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Completados</span>
                  <span className="admin-trend green">OK</span>
                </div>
                <h3>{stats.completados}</h3>
                <p>Finalizados</p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Acceso rapido</h2>
            <div className="admin-quick-grid">
              <Link className="admin-quick-card" to="/cobertura-tiempo-real">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Cobertura en tiempo real</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Monitorea el estado de todas las zonas activas.</p>
                </div>
              </Link>
              <Link className="admin-quick-card" to="/gestion-incidentes">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Gestion de incidentes</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Consulta incidentes reportados y su estado de atencion.</p>
                </div>
              </Link>
              <Link className="admin-quick-card" to="/analiticas">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Analiticas</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Visualiza metricas, reportes y tendencias del sistema.</p>
                </div>
              </Link>
            </div>
          </section>

          <section className="section">
            <h2>Turnos recientes</h2>
            {loading ? (
              <p>Cargando turnos...</p>
            ) : (
              <div className="table-card">
                <div className="table-wrap">
                  <table>
                    <thead className="thead-admin">
                      <tr>
                        <th>Profesor</th>
                        <th>Zona</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnos.slice(0, 8).map((turno) => (
                        <tr key={turno.id} className="table-row-hover">
                          <td>{turno.docente?.nombre || 'Sin asignar'}</td>
                          <td>{turno.zonaNombre}</td>
                          <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                          <td>{turno.horaInicio}</td>
                          <td>
                            <span className="badge">{turno.estado}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </ProtectedLayout>
  )
}
