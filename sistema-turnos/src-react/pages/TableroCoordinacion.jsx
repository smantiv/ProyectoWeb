import React from 'react'
import { Link } from 'react-router-dom'
import ProtectedLayout from '../components/ProtectedLayout'
import NavBar from '../components/NavBar'

const accesos = [
  {
    title: 'Cobertura en tiempo real',
    description: 'Consulta el estado de cobertura de las zonas activas.',
    to: '/cobertura-tiempo-real',
  },
  {
    title: 'Gestion de incidentes',
    description: 'Revisa incidentes abiertos y su seguimiento operativo.',
    to: '/gestion-incidentes',
  },
  {
    title: 'Gestion de turnos',
    description: 'Consulta la programacion general y cambios de cobertura.',
    to: '/gestion-turnos',
  },
  {
    title: 'Analiticas',
    description: 'Visualiza tendencias, indicadores y reportes del sistema.',
    to: '/analiticas',
  },
]

export default function TableroCoordinacion() {
  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="container">
          <section className="section-header">
            <h1>Tablero de coordinacion</h1>
            <p>Vista central para supervision, seguimiento y acceso rapido a los modulos del coordinador.</p>
          </section>

          <section className="section">
            <div className="admin-quick-grid">
              {accesos.map((item) => (
                <Link key={item.to} className="admin-quick-card" to={item.to}>
                  <div className="admin-quick-content">
                    <div className="admin-quick-head">
                      <h3>{item.title}</h3>
                      <span className="admin-arrow">Ir</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </ProtectedLayout>
  )
}
