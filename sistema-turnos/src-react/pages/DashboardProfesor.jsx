import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import NavBar from '../components/NavBar'
import ProtectedLayout from '../components/ProtectedLayout'
import { TurnoService } from '../services/apiServices'

export default function DashboardProfesor() {
  const { user } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [stats, setStats] = useState({
    proximosTurnos: 0,
    completados: 0,
    porAsignar: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const response = await TurnoService.obtenerTodos()
        const turnosCargados = response.data || []
        setTurnos(turnosCargados)

        const ahora = new Date()
        setStats({
          proximosTurnos: turnosCargados.filter((turno) => new Date(turno.fecha) >= ahora).length,
          completados: turnosCargados.filter((turno) => turno.estado === 'COMPLETADO').length,
          porAsignar: turnosCargados.filter((turno) => turno.profesor === 'Sin asignar').length,
        })
      } catch (error) {
        console.error('Error cargando turnos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarTurnos()
  }, [])

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <div className="container">
          <section className="section">
            <h1>Panel del profesor</h1>
            <p>Bienvenido, {user?.nombre}. Aqui ves el estado general de tus turnos.</p>
          </section>

          <section className="section">
            <h2>Resumen</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orange">PROX</div>
                <div>
                  <div className="stat-value orange-text">{stats.proximosTurnos}</div>
                  <div className="stat-label">Proximos turnos</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">OK</div>
                <div>
                  <div className="stat-value green-text">{stats.completados}</div>
                  <div className="stat-label">Completados</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon navy">PEND</div>
                <div>
                  <div className="stat-value navy-text">{stats.porAsignar}</div>
                  <div className="stat-label">Sin asignar</div>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <h2>Acciones rapidas</h2>
            <div className="action-grid">
              <Link className="action-card" to="/mis-turnos">
                <div className="action-icon orange">1</div>
                <span className="action-title">Ver mis turnos</span>
              </Link>
              <Link className="action-card" to="/registrar-punto">
                <div className="action-icon navy">2</div>
                <span className="action-title">Registrar punto de control</span>
              </Link>
              <Link className="action-card" to="/reportar-incidente">
                <div className="action-icon red">3</div>
                <span className="action-title">Reportar incidente</span>
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
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Zona</th>
                        <th>Hora inicio</th>
                        <th>Hora fin</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnos.slice(0, 5).map((turno) => (
                        <tr key={turno.id}>
                          <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                          <td>{turno.zonaNombre}</td>
                          <td>{turno.horaInicio}</td>
                          <td>{turno.horaFin}</td>
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

          <section className="section">
            <div className="cta-wrap">
              <Link className="btn btn-primary btn-large" to="/solicitar-reemplazo">
                Solicitar reemplazo
              </Link>
            </div>
          </section>
        </div>
      </div>
    </ProtectedLayout>
  )
}
