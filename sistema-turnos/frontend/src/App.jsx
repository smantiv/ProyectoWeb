import { Navigate, Route, Routes } from 'react-router-dom';
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
      <Route element={<AppLayout />}>
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/dashboard-profesor" element={<ProfesorDashboard />} />
        <Route path="/dashboard-coordinador" element={<CoordinadorDashboard />} />
        <Route path="/profesores" element={<ProfesoresPage />} />
        <Route path="/turnos" element={<TurnosPage />} />
        <Route path="/detalle-turno" element={<Navigate to="/turnos" replace />} />
        <Route path="/zonas" element={<ZonasPage />} />
        <Route path="/incidentes" element={<IncidentesPage />} />
        <Route path="/tablero-coordinacion" element={<TableroCoordinacionPage />} />
        <Route path="/mis-turnos" element={<MisTurnosPage />} />
        <Route path="/registrar-punto" element={<RegistrarPuntoPage />} />
        <Route path="/check-in-punto" element={<CheckInPuntoPage />} />
        <Route path="/reportar-incidente" element={<ReportarIncidentePage />} />
        <Route path="/solicitar-reemplazo" element={<SolicitarReemplazoPage />} />
        <Route path="/analiticas" element={<AnalyticsPage />} />
        <Route path="/cobertura" element={<CoberturaPage />} />
        <Route path="/metricas-docentes" element={<MetricasDocentesPage />} />
        <Route path="/reconocimientos" element={<ReconocimientosPage />} />
        <Route path="/reglas-operativas" element={<ReglasOperativasPage />} />
        <Route path="/mi-perfil" element={<ProfilePage role="ADMIN" />} />
        <Route path="/mi-perfil-profesor" element={<ProfilePage role="DOCENTE" />} />
        <Route path="/mi-perfil-coordinador" element={<ProfilePage role="COORDINADOR" />} />
        <Route path="/soporte" element={<SoportePage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

