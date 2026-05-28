import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import {
  AdminDashboard,
  AnalyticsPage,
  CheckInPuntoPage,
  CoberturaPage,
  ContactoPage,
  CoordinadorDashboard,
  IncidentesPage,
  LoginPage,
  MetricasDocentesPage,
  MisTurnosPage,
  NotFoundPage,
  PinDinamicoPage,
  ProfilePage,
  ProfesoresPage,
  ProfesorDashboard,
  ReconocimientosPage,
  RegistrarPuntoPage,
  ReglasOperativasPage,
  ReportarIncidentePage,
  SoportePage,
  SolicitarReemplazoPage,
  TableroCoordinacionPage,
  TurnosPage,
  ZonasPage,
} from './pages/pages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard-admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/dashboard-profesor" element={<ProtectedRoute roles={['DOCENTE']}><ProfesorDashboard /></ProtectedRoute>} />
        <Route path="/dashboard-coordinador" element={<ProtectedRoute roles={['COORDINADOR']}><CoordinadorDashboard /></ProtectedRoute>} />
        <Route path="/profesores" element={<ProtectedRoute roles={['ADMIN']}><ProfesoresPage /></ProtectedRoute>} />
        <Route path="/turnos" element={<ProtectedRoute roles={['ADMIN', 'COORDINADOR']}><TurnosPage /></ProtectedRoute>} />
        <Route path="/detalle-turno" element={<Navigate to="/turnos" replace />} />
        <Route path="/zonas" element={<ProtectedRoute roles={['ADMIN']}><ZonasPage /></ProtectedRoute>} />
        <Route path="/incidentes" element={<ProtectedRoute roles={['COORDINADOR', 'ADMIN']}><IncidentesPage /></ProtectedRoute>} />
        <Route path="/tablero-coordinacion" element={<ProtectedRoute roles={['COORDINADOR']}><TableroCoordinacionPage /></ProtectedRoute>} />
        <Route path="/mis-turnos" element={<ProtectedRoute roles={['DOCENTE']}><MisTurnosPage /></ProtectedRoute>} />
        <Route path="/registrar-punto" element={<ProtectedRoute roles={['DOCENTE']}><RegistrarPuntoPage /></ProtectedRoute>} />
        <Route path="/check-in-punto" element={<ProtectedRoute roles={['DOCENTE']}><CheckInPuntoPage /></ProtectedRoute>} />
        <Route path="/pin-dinamico" element={<ProtectedRoute roles={['DOCENTE']}><PinDinamicoPage /></ProtectedRoute>} />
        <Route path="/reportar-incidente" element={<ProtectedRoute roles={['DOCENTE']}><ReportarIncidentePage /></ProtectedRoute>} />
        <Route path="/solicitar-reemplazo" element={<ProtectedRoute roles={['DOCENTE']}><SolicitarReemplazoPage /></ProtectedRoute>} />
        <Route path="/analiticas" element={<ProtectedRoute roles={['COORDINADOR', 'ADMIN']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/cobertura" element={<ProtectedRoute roles={['COORDINADOR']}><CoberturaPage /></ProtectedRoute>} />
        <Route path="/metricas-docentes" element={<ProtectedRoute roles={['COORDINADOR', 'ADMIN']}><MetricasDocentesPage /></ProtectedRoute>} />
        <Route path="/reconocimientos" element={<ProtectedRoute roles={['COORDINADOR', 'ADMIN']}><ReconocimientosPage /></ProtectedRoute>} />
        <Route path="/reglas-operativas" element={<ProtectedRoute roles={['ADMIN', 'COORDINADOR', 'DOCENTE']}><ReglasOperativasPage /></ProtectedRoute>} />
        <Route path="/mi-perfil" element={<ProtectedRoute roles={['ADMIN']}><ProfilePage role="ADMIN" /></ProtectedRoute>} />
        <Route path="/mi-perfil-profesor" element={<ProtectedRoute roles={['DOCENTE']}><ProfilePage role="DOCENTE" /></ProtectedRoute>} />
        <Route path="/mi-perfil-coordinador" element={<ProtectedRoute roles={['COORDINADOR']}><ProfilePage role="COORDINADOR" /></ProtectedRoute>} />
        <Route path="/soporte" element={<ProtectedRoute roles={['ADMIN', 'COORDINADOR', 'DOCENTE']}><SoportePage /></ProtectedRoute>} />
        <Route path="/contacto" element={<ProtectedRoute roles={['ADMIN', 'COORDINADOR', 'DOCENTE']}><ContactoPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
