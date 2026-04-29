import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ProtectedLayout from '../components/ProtectedLayout'
import NavBar from '../components/NavBar'
import { MiniStatsCard } from '../components/StatsCard'
import { TurnoService } from '../services/apiServices'
import { FilterCard, FilterField } from '../components/FilterCard'
import { DataTable } from '../components/DataTable'
import { calculatePercentage, formatDate } from '../utils/helpers'

export const MisTurnos = () => {
  const { user } = useAuth()
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    fecha: '',
    zona: 'Todas',
    estado: 'Todos',
  })

  useEffect(() => {
    const cargarMisTurnos = async () => {
      try {
        setLoading(true)
        const response = await TurnoService.obtenerTodos()
        setTurnos(response.data || [])
      } catch (error) {
        console.error('Error cargando turnos:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarMisTurnos()
  }, [])

  const turnosFiltrados = turnos.filter((turno) => {
    const matchFecha = !filtros.fecha || turno.fecha === filtros.fecha
    const matchZona = filtros.zona === 'Todas' || turno.zonaNombre === filtros.zona
    const matchEstado = filtros.estado === 'Todos' || turno.estado === filtros.estado
    return matchFecha && matchZona && matchEstado
  })

  const completados = turnos.filter((turno) => turno.estado === 'COMPLETADO').length
  const proximoTurno = turnos[0] ? `${formatDate(turnos[0].fecha)} ${turnos[0].horaInicio}` : 'Sin turnos'

  const columns = [
    { key: 'fecha', label: 'Fecha', render: (value) => formatDate(value) },
    { key: 'horaInicio', label: 'Horario', render: (value, row) => `${value} - ${row.horaFin}` },
    { key: 'zonaNombre', label: 'Zona asignada' },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`badge badge-${value === 'COMPLETADO' ? 'success' : value === 'ACTIVO' ? 'info' : 'warning'}`}>
          {value}
        </span>
      ),
    },
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
              <h1>Mis turnos</h1>
              <p>Vista consolidada para {user?.nombre || 'profesor'}.</p>
            </section>

            <section className="section">
              <div className="mis-stats-grid">
                <MiniStatsCard icon="TOTAL" label="Turnos cargados" value={turnos.length} textColor="navy-text" />
                <MiniStatsCard icon="PROX" label="Proximo turno" value={proximoTurno} textColor="orange-text" />
                <MiniStatsCard
                  icon="OK"
                  label="Completados"
                  value={`${completados} (${calculatePercentage(completados, turnos.length)})`}
                  textColor="green-text"
                />
              </div>
            </section>

            <FilterCard>
              <FilterField label="Fecha">
                <input type="date" value={filtros.fecha} onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} />
              </FilterField>

              <FilterField label="Zona">
                <select value={filtros.zona} onChange={(e) => setFiltros({ ...filtros, zona: e.target.value })}>
                  <option value="Todas">Todas</option>
                  <option value="Zona A">Zona A</option>
                  <option value="Zona B">Zona B</option>
                  <option value="Zona C">Zona C</option>
                </select>
              </FilterField>

              <FilterField label="Estado">
                <select value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                  <option value="Todos">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ACTIVO">Activo</option>
                  <option value="COMPLETADO">Completado</option>
                </select>
              </FilterField>
            </FilterCard>

            <DataTable
              columns={columns}
              data={turnosFiltrados}
              loading={loading}
              actions={() => (
                <div className="table-action-buttons">
                  <button className="btn btn-sm btn-primary">Ver</button>
                </div>
              )}
              emptyMessage="No hay turnos disponibles"
            />
          </div>
        </main>
      </div>
    </ProtectedLayout>
  )
}

export default MisTurnos
