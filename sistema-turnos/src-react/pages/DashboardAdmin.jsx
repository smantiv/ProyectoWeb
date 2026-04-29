import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import NavBar from '../components/NavBar'
import ProtectedLayout from '../components/ProtectedLayout'
import { DocenteService, IncidenteService, TurnoService, ZonaService } from '../services/apiServices'

export default function DashboardAdmin() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTurnos: 0,
    profesores: 0,
    incidentes: 0,
    zonas: 0,
  })
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [turnosRes, docentesRes, incidentesRes, zonasRes] = await Promise.all([
          TurnoService.obtenerTodos(),
          DocenteService.obtenerTodos(),
          IncidenteService.obtenerTodos(),
          ZonaService.obtenerTodos(),
        ])

        const turnosCargados = turnosRes.data || []
        setTurnos(turnosCargados)
        setStats({
          totalTurnos: turnosCargados.length,
          profesores: (docentesRes.data || []).length,
          incidentes: (incidentesRes.data || []).length,
          zonas: (zonasRes.data || []).length,
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
            <h1>Panel de administracion</h1>
            <p>Control general del sistema para {user?.nombre || 'administracion'}.</p>
          </section>

          <section className="section">
            <h2>Metricas del sistema</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Total turnos</span>
                  <span className="admin-trend orange-text">TURNOS</span>
                </div>
                <h3>{stats.totalTurnos}</h3>
                <p>En el sistema</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Profesores</span>
                  <span className="admin-trend green">DOC</span>
                </div>
                <h3>{stats.profesores}</h3>
                <p>Registrados</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Incidentes</span>
                  <span className="admin-trend red">INC</span>
                </div>
                <h3>{stats.incidentes}</h3>
                <p>Registrados</p>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-top">
                  <span>Zonas</span>
                  <span className="admin-trend blue-text">ZONAS</span>
                </div>
                <h3>{stats.zonas}</h3>
                <p>Monitoreadas</p>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Acceso rapido</h2>
            <div className="admin-quick-grid">
              <Link className="admin-quick-card" to="/gestion-profesores">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Gestion de profesores</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Administra registro, estado y asignacion de docentes.</p>
                </div>
              </Link>
              <Link className="admin-quick-card" to="/gestion-zonas">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Gestion de zonas</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Configura zonas de vigilancia y su cobertura.</p>
                </div>
              </Link>
              <Link className="admin-quick-card" to="/gestion-turnos">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Gestion de turnos</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Programa y organiza la operacion semanal.</p>
                </div>
              </Link>
              <Link className="admin-quick-card" to="/reglas-operativas">
                <div className="admin-quick-content">
                  <div className="admin-quick-head">
                    <h3>Reglas operativas</h3>
                    <span className="admin-arrow">Ir</span>
                  </div>
                  <p>Consulta parametros y lineamientos del sistema.</p>
                </div>
              </Link>
            </div>
          </section>

          <section className="section">
            <h2>Ultimos turnos</h2>
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
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnos.slice(0, 10).map((turno) => (
                        <tr key={turno.id} className="table-row-hover">
                          <td>{turno.docente?.nombre || 'Sin asignar'}</td>
                          <td>{turno.zonaNombre}</td>
                          <td>{new Date(turno.fecha).toLocaleDateString()}</td>
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
