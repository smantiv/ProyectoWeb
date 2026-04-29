import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages - Dashboards
import LoginPage from './pages/LoginPage'
import DashboardProfesor from './pages/DashboardProfesor'
import DashboardCoordinador from './pages/DashboardCoordinador'
import DashboardAdmin from './pages/DashboardAdmin'

// Pages - Admin Management
import GestionProfesores from './pages/GestionProfesores'
import GestionTurnos from './pages/GestionTurnos'
import GestionZonas from './pages/GestionZonas'
import ReglasOperativas from './pages/ReglasOperativas'

// Pages - Coordinator Monitoring
import CoberturaTiempoReal from './pages/CoberturaTiempoReal'
import GestionIncidentes from './pages/GestionIncidentes'
import TableroCoordinacion from './pages/TableroCoordinacion'

// Pages - Analytics & Reports
import Analiticas from './pages/Analiticas'
import MetricasPositivasDocentes from './pages/MetricasPositivasDocentes'
import ReconocimientosInstitucionales from './pages/ReconocimientosInstitucionales'

// Pages - Teacher Features
import MisTurnos from './pages/MisTurnos'
import RegistrarPunto from './pages/RegistrarPunto'
import ReportarIncidente from './pages/ReportarIncidente'
import SolicitarReemplazo from './pages/SolicitarReemplazo'

// Pages - Profiles
import PerfilCuenta from './pages/PerfilCuenta'
import PerfilCoordinador from './pages/PerfilCoordinador'
import PerfilProfesor from './pages/PerfilProfesor'

// Pages - Support & Info
import Contacto from './pages/Contacto'
import Soporte from './pages/Soporte'
import EjemploAPI from './pages/EjemploAPI'

function App() {
  const aliasRoutes = [
    { paths: ['/dashboard-profesor', '/dashboard-profesor.html'], element: <DashboardProfesor /> },
    { paths: ['/dashboard-coordinador', '/dashboard-coordinador.html'], element: <DashboardCoordinador /> },
    { paths: ['/dashboard-admin', '/dashboard-admin.html', '/admin/dashboard'], element: <DashboardAdmin /> },
    { paths: ['/gestion-profesores', '/gestion-profesores.html', '/admin/profesores', '/profesores'], element: <GestionProfesores /> },
    { paths: ['/gestion-turnos', '/gestion-turnos.html', '/admin/turnos', '/turnos'], element: <GestionTurnos /> },
    { paths: ['/gestion-zonas', '/gestion-zonas.html', '/admin/zonas'], element: <GestionZonas /> },
    { paths: ['/reglas-operativas', '/reglas-operativas.html', '/admin/reglas'], element: <ReglasOperativas /> },
    { paths: ['/cobertura-tiempo-real', '/cobertura-tiempo-real.html', '/coordinador/cobertura'], element: <CoberturaTiempoReal /> },
    { paths: ['/gestion-incidentes', '/gestion-incidentes.html', '/coordinador/incidentes'], element: <GestionIncidentes /> },
    { paths: ['/tablero-coordinacion', '/tablero-coordinacion.html', '/coordinacion'], element: <TableroCoordinacion /> },
    { paths: ['/analiticas', '/analiticas.html', '/analitica'], element: <Analiticas /> },
    { paths: ['/MetricasPositivasDocentes', '/MetricasPositivasDocentes.html', '/metricas/docentes'], element: <MetricasPositivasDocentes /> },
    { paths: ['/reconocimientos', '/reconocimientos-institucionales', '/reconocimientos-institucionales.html'], element: <ReconocimientosInstitucionales /> },
    { paths: ['/mis-turnos', '/mis-turnos.html', '/profesor/turnos'], element: <MisTurnos /> },
    { paths: ['/registrar-punto', '/registrar-punto.html', '/profesor/checkpoint'], element: <RegistrarPunto /> },
    { paths: ['/reportar-incidente', '/reportar-incidente.html', '/profesor/incidente', '/incidentes/reportar'], element: <ReportarIncidente /> },
    { paths: ['/solicitar-reemplazo', '/solicitar-reemplazo.html', '/profesor/reemplazo'], element: <SolicitarReemplazo /> },
    { paths: ['/perfil-cuenta', '/perfil-cuenta.html', '/perfil/cuenta', '/perfil'], element: <PerfilCuenta /> },
    { paths: ['/perfil-coordinador', '/perfil-coordinador.html', '/perfil/coordinador'], element: <PerfilCoordinador /> },
    { paths: ['/perfil-profesor', '/perfil-profesor.html', '/perfil/profesor', '/mi-perfil-profesor'], element: <PerfilProfesor /> },
    { paths: ['/contacto', '/contacto.html'], element: <Contacto /> },
    { paths: ['/soporte', '/soporte.html'], element: <Soporte /> },
    { paths: ['/api-example', '/ejemplo-api', '/ejemplo-api.html'], element: <EjemploAPI /> },
  ]

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Login */}
          <Route path="/" element={<LoginPage />} />
          {aliasRoutes.flatMap((route) =>
            route.paths.map((path) => <Route key={path} path={path} element={route.element} />)
          )}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
