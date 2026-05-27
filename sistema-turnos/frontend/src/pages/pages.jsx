import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Contact,
  LifeBuoy,
  MapPinned,
  Medal,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { Button, DataTable, ErrorState, LoadingState, Message, Modal, StatCard } from '../components/ui';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../context/useAuth';
import {
  analyticsService,
  asignacionesService,
  checkpointsService,
  docentesService,
  incidentesService,
  reasignacionesService,
  recorridosService,
  turnosService,
  usuariosService,
  zonasService,
} from '../services/resources';

const roleRoutes = {
  ADMIN: '/dashboard-admin',
  DOCENTE: '/dashboard-profesor',
  COORDINADOR: '/dashboard-coordinador',
};

const RECORRIDO_EVIDENCE_MINUTES = 10;
const CHECKIN_REMINDER_MINUTES = 10;
const CHECKIN_GRACE_MINUTES = 2;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatDate(value) {
  return value ? String(value).slice(0, 10) : 'Sin fecha';
}

function formatTime(value) {
  return value ? String(value).slice(0, 5) : '--:--';
}

function nowLocalDateTime() {
  return new Date().toISOString().slice(0, 19);
}

function parseLocalDateTime(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(' ', 'T'));
  return Number.isNaN(date.getTime()) ? null : date;
}

function getFormValue(form, name) {
  const value = new FormData(form).get(name);
  return value === '' ? null : value;
}
// funciones agregadas para persona 3 
function formatDateTime(value) {
  return value ? String(value).replace('T', ' ').slice(0, 16) : 'Sin fecha';
}

function formatHourFromDateTime(value) {
  return value ? String(value).slice(11, 16) : '--:--';
}

function docenteNombre(docente) {
  return docente?.usuario?.nombre || docente?.nombre || `Docente ${docente?.id || ''}`;
}

function getFranja(horaInicio) {
  const hour = Number(String(horaInicio || '').slice(0, 2));
  if (Number.isNaN(hour)) return 'sin-franja';
  if (hour >= 6 && hour < 12) return 'manana';
  if (hour >= 12 && hour < 18) return 'tarde';
  return 'noche';
}

function buildStartDate(turno) {
  if (!turno?.fecha || !turno?.horaInicio) return null;
  const hora = String(turno.horaInicio).length === 5 ? `${turno.horaInicio}:00` : String(turno.horaInicio);
  const date = new Date(`${turno.fecha}T${hora}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function minutesSinceStart(turno) {
  const start = buildStartDate(turno);
  if (!start) return null;
  return Math.floor((Date.now() - start.getTime()) / 60000);
}

function getTurnoReminder(turno, now = new Date()) {
  const start = buildStartDate(turno);
  const visualState = getDocenteTurnoState(turno, now);
  if (!start || !['pendiente', 'por-iniciar'].includes(visualState.key)) return null;

  const minutesUntil = Math.ceil((start.getTime() - now.getTime()) / 60000);
  if (minutesUntil < 0 || minutesUntil > CHECKIN_REMINDER_MINUTES) return null;

  return {
    key: `${turno.asignacionId}-${minutesUntil <= 5 ? '5' : '10'}`,
    minutes: minutesUntil <= 5 ? 5 : 10,
    turno,
  };
}

function generateDemoCheckinPin(checkpointId, now = Date.now()) {
  const windowSlot = Math.floor(now / 30000);
  const seed = (Number(checkpointId) * 7919) + (windowSlot * 104729);
  return String(Math.abs(seed % 9000) + 1000).slice(0, 4);
}

function getRecorridoConfirmation(turno, recorridosByAsignacion = {}, now = new Date()) {
  if (getDocenteTurnoState(turno, now).key !== 'en-curso') return null;

  const start = buildStartDate(turno);
  const end = turno.fecha && turno.horaFin ? new Date(`${turno.fecha}T${String(turno.horaFin).slice(0, 8)}`) : null;
  if (!start || now < start || (end && now >= end)) return null;

  const recorridos = asArray(recorridosByAsignacion[String(turno.asignacionId)]);
  const lastRecorridoAt = recorridos
    .map((recorrido) => parseLocalDateTime(recorrido.fechaHora))
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const lastEvidenceAt = lastRecorridoAt || parseLocalDateTime(turno.horaCheckin);
  if (!lastEvidenceAt) return null;

  const minutesWithoutEvidence = Math.floor((now.getTime() - lastEvidenceAt.getTime()) / 60000);
  if (minutesWithoutEvidence < RECORRIDO_EVIDENCE_MINUTES) return null;

  return {
    key: `recorrido-${turno.asignacionId}`,
    minutesWithoutEvidence,
    lastEvidenceAt,
    turno,
  };
}

function getDocenteTurnoState(turno, now = new Date()) {
  const estado = String(turno.estado || '').toLowerCase();
  const start = buildStartDate(turno);
  const end = turno?.fecha && turno?.horaFin ? new Date(`${turno.fecha}T${String(turno.horaFin).slice(0, 8)}`) : null;

  if (estado.includes('cerrad')) return { key: 'cerrado', label: 'Cerrado' };
  if (estado.includes('reasign')) return { key: 'reasignado', label: 'Reasignado' };
  if (turno?.horaCheckin) return { key: 'en-curso', label: 'En curso / cubierta', canWorkTurno: true };
  if (!start) return { key: 'pendiente', label: 'Pendiente', canRequestReplacement: true };

  const minutesUntil = Math.ceil((start.getTime() - now.getTime()) / 60000);
  const minutesAfterStart = Math.floor((now.getTime() - start.getTime()) / 60000);

  if (end && now >= end) return { key: 'sin-cobertura', label: 'Sin cobertura' };
  if (minutesUntil > CHECKIN_REMINDER_MINUTES) return { key: 'pendiente', label: 'Pendiente', canRequestReplacement: true };
  if (minutesUntil >= 0 || minutesAfterStart < CHECKIN_GRACE_MINUTES) {
    return { key: 'por-iniciar', label: 'Por iniciar', canCheckin: true, canRequestReplacement: true };
  }
  return { key: 'sin-cobertura', label: 'Sin cobertura', canCheckin: true, canRequestReplacement: true };
}

function getCoverageStatus(asignacion, turno) {
  if (!asignacion) {
    return {
      label: 'Sin cobertura',
      className: 'sin-cobertura',
      alerta: 'Turno sin docente asignado',
    };
  }

  if (asignacion.horaCierre) {
    return {
      label: 'Cerrado',
      className: 'cerrado',
      alerta: 'Turno finalizado',
    };
  }

  if (asignacion.horaCheckin) {
    return {
      label: 'Cubierta',
      className: 'cubierta',
      alerta: 'Check-in registrado',
    };
  }

  const minutes = minutesSinceStart(turno);

  if (minutes !== null && minutes >= 2) {
    return {
      label: 'Sin cobertura',
      className: 'sin-cobertura',
      alerta: `Ausencia detectada hace ${minutes} min`,
    };
  }

  return {
    label: 'Por iniciar',
    className: 'por-iniciar',
    alerta: 'Dentro del margen operativo',
  };
}

function getRecorridoStatus(asignacion, recorridos) {
  if (!asignacion) return 'Sin asignación';

  const total = recorridos.filter((recorrido) => String(recorrido.asignacionId) === String(asignacion.id)).length;

  return total > 0 ? `${total} recorrido(s)` : 'Sin evidencia';
}

function buildCoverageRows({ turnos, asignaciones, docentes, zonas, recorridos }) {
  const docentesById = new Map(docentes.map((docente) => [String(docente.id), docente]));
  const zonasById = new Map(zonas.map((zona) => [String(zona.id), zona]));

  return turnos.map((turno) => {
    const asignacion = asignaciones.find((item) => String(item.turnoId) === String(turno.id));
    const docente = asignacion ? docentesById.get(String(asignacion.docenteId)) : null;
    const zona = zonasById.get(String(turno.zonaId));
    const status = getCoverageStatus(asignacion, turno);

    return {
      id: turno.id,
      turnoId: turno.id,
      asignacionId: asignacion?.id,
      docenteNombre: docente ? docenteNombre(docente) : 'Sin docente',
      zonaId: turno.zonaId,
      zona: zona?.nombre || 'Sin zona',
      fecha: turno.fecha,
      horaInicio: turno.horaInicio,
      horaCheckin: asignacion?.horaCheckin,
      estadoCobertura: status.label,
      estadoClass: status.className,
      alerta: status.alerta,
      estadoRecorrido: getRecorridoStatus(asignacion, recorridos),
      franja: getFranja(turno.horaInicio),
    };
  });
} 
// fin de persona 3

function PageHeader({ title, description, action }) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}

function FormField({ label, name, defaultValue = '', type = 'text', required = false, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children || <input name={name} defaultValue={defaultValue ?? ''} type={type} required={required} />}
    </label>
  );
}

export function LoginPage() {
  const [error, setError] = useState(null);
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const email = getFormValue(form, 'email');
    try {
      const user = await login(email);
      navigate(roleRoutes[user.rol] || '/dashboard-profesor');
    } catch {
      setError('No existe un usuario API con ese correo. Usa uno de data.sql o acceso rapido.');
    }
  }

  function enterAs(role) {
    quickLogin(role);
    navigate(roleRoutes[role]);
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div>
          <h1>Sistema de Vigilancia Escolar</h1>
          <p>SPA React conectada a la API REST del sistema de turnos.</p>
        </div>
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Ingresar</h2>
          <FormField label="Correo institucional" name="email" type="email" defaultValue="admin@test.com" required />
          <FormField label="Contrasena" name="password" type="password" defaultValue="1234" />
          {error ? <Message type="error">{error}</Message> : null}
          <Button type="submit"><Save size={16} />Entrar con API</Button>
        </form>
        <div className="quick-role-grid">
          <button type="button" onClick={() => enterAs('DOCENTE')}>Profesor</button>
          <button type="button" onClick={() => enterAs('COORDINADOR')}>Coordinador</button>
          <button type="button" onClick={() => enterAs('ADMIN')}>Admin</button>
        </div>
      </section>
    </main>
  );
}

export function AdminDashboard() {
  const { data, loading, error } = useAsync(async () => {
    const [docentes, turnos, zonas, incidentes] = await Promise.all([
      docentesService.list(),
      turnosService.list(),
      zonasService.list(),
      incidentesService.list(),
    ]);
    return { docentes: asArray(docentes), turnos: asArray(turnos), zonas: asArray(zonas), incidentes: asArray(incidentes) };
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Dashboard Admin" description="Resumen operativo y accesos a gestion." />
      <section className="stats-grid">
        <StatCard icon={<Users />} label="Profesores" value={data.docentes.length} />
        <StatCard icon={<CalendarCheck />} label="Turnos" value={data.turnos.length} tone="orange" />
        <StatCard icon={<MapPinned />} label="Zonas" value={data.zonas.length} tone="green" />
        <StatCard icon={<AlertTriangle />} label="Incidentes" value={data.incidentes.length} tone="red" />
      </section>
      <section className="action-grid">
        <Link to="/profesores" className="action-card"><Users />Gestion de profesores</Link>
        <Link to="/turnos" className="action-card"><CalendarCheck />Gestion de turnos</Link>
        <Link to="/zonas" className="action-card"><MapPinned />Gestion de zonas</Link>
        <Link to="/reglas-operativas" className="action-card"><ShieldCheck />Reglas operativas</Link>
      </section>
    </>
  );
}

export function ProfesorDashboard() {
  return (
    <>
      <PageHeader title="Dashboard Profesor" description="Acciones diarias para turnos, checkpoints e incidentes." />
      <section className="action-grid">
        <Link to="/mis-turnos" className="action-card"><CalendarCheck />Mis turnos</Link>
        <Link to="/registrar-punto" className="action-card"><ClipboardCheck />Registrar punto</Link>
        <Link to="/reportar-incidente" className="action-card"><AlertTriangle />Reportar incidente</Link>
        <Link to="/solicitar-reemplazo" className="action-card"><RefreshCw />Solicitar reemplazo</Link>
      </section>
    </>
  );
}
// modificaciones para persona 3, se agregan funciones de formato y logica de negocio para el dashboard del coordinador, ademas de la funcion buildCoverageRows que prepara los datos para mostrar el estado de cobertura en el tablero de coordinacion.
export function CoordinadorDashboard() {
  const { data, loading, error } = useAsync(async () => {
    const [activas, reasignaciones, heatmap] = await Promise.all([
      asignacionesService.activas(),
      reasignacionesService.byEstado('pendiente'),
      analyticsService.heatmap({ rango: 7 }),
    ]);
    return { activas: asArray(activas), reasignaciones: asArray(reasignaciones), heatmap };
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Dashboard Coordinador" description="Seguimiento operativo de cobertura, incidentes y reemplazos." />
      <section className="stats-grid">
        <StatCard icon={<ShieldCheck />} label="Turnos activos" value={data.activas.length} tone="green" />
        <StatCard icon={<RefreshCw />} label="Reemplazos pendientes" value={data.reasignaciones.length} tone="orange" />
        <StatCard icon={<AlertTriangle />} label="Incidentes visibles" value={data.heatmap?.resumen?.totalIncidentes || 0} tone="red" />
      </section>
      <section className="action-grid">
        <Link to="/tablero-coordinacion" className="action-card">
          <ShieldCheck />
          Tablero de coordinación
        </Link>
        <Link to="/cobertura" className="action-card">
          <MapPinned />
          Cobertura en tiempo real
        </Link>
        <Link to="/incidentes" className="action-card">
          <AlertTriangle />
          Gestionar incidentes
        </Link>
        <Link to="/turnos" className="action-card">
          <CalendarCheck />
          Ver turnos
        </Link>
      </section>
    </>
  );
}

export function ProfesoresPage() {
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const { data, loading, error, reload } = useAsync(() => docentesService.list(), []);
  const docentes = asArray(data);

  async function save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const usuario = {
      nombre: getFormValue(form, 'nombre'),
      email: getFormValue(form, 'email'),
      password: getFormValue(form, 'password') || '1234',
      rol: getFormValue(form, 'rol'),
      activo: getFormValue(form, 'activo') === 'true',
    };
    const codigoInstitucional = getFormValue(form, 'codigoInstitucional');
    if (editing) {
      const usuarioId = editing.usuario?.id;
      if (usuarioId) await usuariosService.update(usuarioId, usuario);
      await docentesService.update(editing.id, { id: editing.id, codigoInstitucional, usuario: { ...usuario, id: usuarioId } });
      setMessage('Profesor actualizado.');
    } else {
      const creado = await usuariosService.create(usuario);
      await docentesService.create({ codigoInstitucional, usuario: creado });
      setMessage('Profesor creado.');
    }
    setEditing(null);
    reload();
  }

  async function remove(docente) {
    if (!confirm(`Eliminar profesor ${docente.usuario?.nombre || docente.id}?`)) return;
    await docentesService.remove(docente.id);
    setMessage('Profesor eliminado.');
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader
        title="Gestion de Profesores"
        description="Listado, creacion, edicion y eliminacion de docentes usando /api/v1/docentes y /api/v1/usuarios."
        action={<Button onClick={() => setEditing({})}><Plus size={16} />Agregar</Button>}
      />
      {message ? <Message>{message}</Message> : null}
      <section className="stats-grid">
        <StatCard icon={<Users />} label="Totales" value={docentes.length} />
        <StatCard icon={<CheckCircle2 />} label="Activos" value={docentes.filter((d) => d.usuario?.activo).length} tone="green" />
      </section>
      <DataTable
        rows={docentes}
        columns={[
          { key: 'nombre', header: 'Nombre', render: (row) => row.usuario?.nombre || 'Sin nombre' },
          { key: 'email', header: 'Correo', render: (row) => row.usuario?.email || 'Sin correo' },
          { key: 'codigoInstitucional', header: 'Codigo' },
          { key: 'rol', header: 'Rol', render: (row) => row.usuario?.rol || 'Sin rol' },
          { key: 'acciones', header: 'Acciones', render: (row) => <RowActions onEdit={() => setEditing(row)} onDelete={() => remove(row)} /> },
        ]}
      />
      {editing ? (
        <Modal title={editing.id ? 'Editar profesor' : 'Agregar profesor'} onClose={() => setEditing(null)}>
          <form className="grid-form" onSubmit={save}>
            <FormField label="Nombre" name="nombre" defaultValue={editing.usuario?.nombre} required />
            <FormField label="Email" name="email" type="email" defaultValue={editing.usuario?.email} required />
            <FormField label="Codigo institucional" name="codigoInstitucional" defaultValue={editing.codigoInstitucional} required />
            <FormField label="Rol" name="rol" defaultValue={editing.usuario?.rol || 'DOCENTE'}>
              <select name="rol" defaultValue={editing.usuario?.rol || 'DOCENTE'}>
                <option>DOCENTE</option>
                <option>ADMIN</option>
                <option>COORDINADOR</option>
              </select>
            </FormField>
            <FormField label="Estado" name="activo">
              <select name="activo" defaultValue={String(editing.usuario?.activo ?? true)}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </FormField>
            <FormField label="Password inicial" name="password" type="password" defaultValue="" />
            <Button type="submit"><Save size={16} />Guardar</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <Button variant="ghost" onClick={onEdit}>Editar</Button>
      <Button variant="danger" onClick={onDelete}><Trash2 size={15} />Eliminar</Button>
    </div>
  );
}

export function ZonasPage() {
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const { data, loading, error, reload } = useAsync(() => zonasService.list(), []);
  const zonas = asArray(data);

  async function save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = { nombre: getFormValue(form, 'nombre'), descripcion: getFormValue(form, 'descripcion') };
    if (editing.id) await zonasService.update(editing.id, payload);
    else await zonasService.create(payload);
    setEditing(null);
    setMessage('Zona guardada.');
    reload();
  }

  async function remove(row) {
    if (!confirm(`Eliminar zona ${row.nombre}?`)) return;
    await zonasService.remove(row.id);
    setMessage('Zona eliminada.');
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Gestion de Zonas" description="Administracion de zonas de vigilancia." action={<Button onClick={() => setEditing({})}><Plus size={16} />Nueva zona</Button>} />
      {message ? <Message>{message}</Message> : null}
      <DataTable
        rows={zonas}
        columns={[
          { key: 'nombre', header: 'Nombre' },
          { key: 'descripcion', header: 'Descripcion' },
          { key: 'acciones', header: 'Acciones', render: (row) => <RowActions onEdit={() => setEditing(row)} onDelete={() => remove(row)} /> },
        ]}
      />
      {editing ? (
        <Modal title={editing.id ? 'Editar zona' : 'Nueva zona'} onClose={() => setEditing(null)}>
          <form className="grid-form" onSubmit={save}>
            <FormField label="Nombre" name="nombre" defaultValue={editing.nombre} required />
            <FormField label="Descripcion" name="descripcion" defaultValue={editing.descripcion} required />
            <Button type="submit"><Save size={16} />Guardar</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export function TurnosPage() {
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);
  const { data, loading, error, reload } = useAsync(async () => {
    const [turnos, zonas, asignaciones] = await Promise.all([turnosService.list(), zonasService.list(), asignacionesService.list()]);
    return { turnos: asArray(turnos), zonas: asArray(zonas), asignaciones: asArray(asignaciones) };
  }, []);

  const zonaMap = new Map(asArray(data?.zonas).map((zona) => [zona.id, zona.nombre]));
  const coberturaMap = new Map(asArray(data?.asignaciones).map((asignacion) => [asignacion.turnoId, asignacion]));

  async function save(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
      fecha: getFormValue(form, 'fecha'),
      horaInicio: getFormValue(form, 'horaInicio'),
      horaFin: getFormValue(form, 'horaFin'),
      estado: getFormValue(form, 'estado'),
      zonaId: Number(getFormValue(form, 'zonaId')),
    };
    if (editing.id) await turnosService.update(editing.id, payload);
    else await turnosService.create(payload);
    setEditing(null);
    setMessage('Turno guardado.');
    reload();
  }

  async function remove(row) {
    if (!confirm(`Eliminar turno ${row.id}?`)) return;
    await turnosService.remove(row.id);
    setMessage('Turno eliminado.');
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Gestion de Turnos" description="Programacion de turnos y estado de cobertura." action={<Button onClick={() => setEditing({ estado: 'PENDIENTE' })}><Plus size={16} />Programar</Button>} />
      {message ? <Message>{message}</Message> : null}
      <DataTable
        rows={data.turnos}
        columns={[
          { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
          { key: 'horario', header: 'Horario', render: (row) => `${formatTime(row.horaInicio)} - ${formatTime(row.horaFin)}` },
          { key: 'zona', header: 'Zona', render: (row) => zonaMap.get(row.zonaId) || 'Sin zona' },
          { key: 'estado', header: 'Estado' },
          { key: 'cobertura', header: 'Cobertura', render: (row) => coberturaMap.has(row.id) ? coberturaMap.get(row.id).estadoCobertura : 'Sin asignar' },
          { key: 'acciones', header: 'Acciones', render: (row) => <RowActions onEdit={() => setEditing(row)} onDelete={() => remove(row)} /> },
        ]}
      />
      {editing ? (
        <Modal title={editing.id ? 'Editar turno' : 'Programar turno'} onClose={() => setEditing(null)}>
          <form className="grid-form" onSubmit={save}>
            <FormField label="Fecha" name="fecha" type="date" defaultValue={editing.fecha} required />
            <FormField label="Hora inicio" name="horaInicio" type="time" defaultValue={formatTime(editing.horaInicio)} required />
            <FormField label="Hora fin" name="horaFin" type="time" defaultValue={formatTime(editing.horaFin)} required />
            <FormField label="Zona" name="zonaId">
              <select name="zonaId" defaultValue={editing.zonaId || data.zonas[0]?.id} required>
                {data.zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}
              </select>
            </FormField>
            <FormField label="Estado" name="estado" defaultValue={editing.estado || 'PENDIENTE'} required />
            <Button type="submit"><Save size={16} />Guardar</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

export function IncidentesPage() {
  const [selected, setSelected] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState('pendientes');
  const { data, loading, error, reload } = useAsync(() => incidentesService.list(), []);
  const incidentes = asArray(data);

  async function setEstado(incidente, estado) {
    await incidentesService.update(incidente.id, { ...incidente, estado });
    setSelected(null);
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const pendientes = incidentes.filter((incidente) => ['reportado', 'en_revision', 'escalado'].includes(incidente.estado));
  const resueltos = incidentes.filter((incidente) => incidente.estado === 'resuelto');

  const filteredIncidentes = incidentes.filter((incidente) => {
    if (estadoFilter === 'todos') return true;
    if (estadoFilter === 'pendientes') return ['reportado', 'en_revision', 'escalado'].includes(incidente.estado);
    return incidente.estado === estadoFilter;
  });

  return (
    <>
      <PageHeader title="Gestión de Incidentes" description="Vista operativa del coordinador para revisar, escalar o resolver situaciones pendientes." />

      <section className="stats-grid">
        <StatCard icon={<AlertTriangle />} label="Pendientes" value={pendientes.length} tone="red" />
        <StatCard icon={<CheckCircle2 />} label="Resueltos" value={resueltos.length} tone="green" />
        <StatCard icon={<ClipboardCheck />} label="Total" value={incidentes.length} />
      </section>

      <section className="filter-row">
        <select value={estadoFilter} onChange={(event) => setEstadoFilter(event.target.value)}>
          <option value="pendientes">Pendientes operativos</option>
          <option value="todos">Todos</option>
          <option value="reportado">Reportados</option>
          <option value="en_revision">En revisión</option>
          <option value="escalado">Escalados</option>
          <option value="resuelto">Resueltos</option>
        </select>
      </section>

      <DataTable
        rows={filteredIncidentes}
        columns={[
          { key: 'tipo', header: 'Tipo' },
          { key: 'severidad', header: 'Severidad', render: (row) => <span className={`badge ${row.severidad}`}>{row.severidad}</span> },
          { key: 'ubicacion', header: 'Ubicación' },
          { key: 'estado', header: 'Estado', render: (row) => <span className={`badge ${row.estado}`}>{row.estado}</span> },
          { key: 'fechaHora', header: 'Fecha', render: (row) => formatDateTime(row.fechaHora) },
          { key: 'acciones', header: 'Acciones', render: (row) => <Button variant="ghost" onClick={() => setSelected(row)}>Ver detalle</Button> },
        ]}
      />

      {selected ? (
        <Modal title={`Incidente #${selected.id}`} onClose={() => setSelected(null)}>
          <div className="detail-stack">
            <p><strong>Tipo:</strong> {selected.tipo}</p>
            <p><strong>Severidad:</strong> {selected.severidad}</p>
            <p><strong>Ubicación:</strong> {selected.ubicacion || 'Sin ubicación'}</p>
            <p><strong>Estado:</strong> {selected.estado}</p>
            <p><strong>Descripción:</strong> {selected.descripcion}</p>
            <p><strong>Asignación:</strong> {selected.asignacionId || 'Sin asignación'}</p>
            <div className="row-actions">
              <Button onClick={() => setEstado(selected, 'en_revision')}>En revisión</Button>
              <Button variant="success" onClick={() => setEstado(selected, 'resuelto')}>Resolver</Button>
              <Button variant="danger" onClick={() => setEstado(selected, 'escalado')}>Escalar</Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

export function MisTurnosPage() {
  const [closingTurno, setClosingTurno] = useState(null);
  const [message, setMessage] = useState(null);
  const [closeError, setCloseError] = useState(null);
  const [now, setNow] = useState(() => new Date());
  const { data, loading, error, reload } = useAsync(async () => {
    const panel = await asignacionesService.panelActual();
    const recorridosEntries = await Promise.all(asArray(panel?.turnos).map(async (turno) => {
      const recorridos = await recorridosService.byAsignacion(turno.asignacionId).catch(() => []);
      return [String(turno.asignacionId), asArray(recorridos)];
    }));
    return { ...panel, recorridosByAsignacion: Object.fromEntries(recorridosEntries) };
  }, []);
  const turnos = asArray(data?.turnos);
  const reminders = turnos.map((turno) => getTurnoReminder(turno, now)).filter(Boolean);
  const recorridoConfirmations = turnos
    .map((turno) => getRecorridoConfirmation(turno, data?.recorridosByAsignacion, now))
    .filter(Boolean);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  function openCloseTurno(turno) {
    setCloseError(null);
    setClosingTurno(turno);
  }

  function cancelCloseTurno() {
    setCloseError(null);
    setClosingTurno(null);
  }

  async function closeTurno(event) {
    event.preventDefault();
    setCloseError(null);
    const form = event.currentTarget;
    const calificacionLimpieza = getFormValue(form, 'calificacionLimpieza');

    if (!calificacionLimpieza) {
      setCloseError('Selecciona una calificacion de limpieza.');
      return;
    }

    try {
      await asignacionesService.cierre(closingTurno.asignacionId, {
        horaCierre: nowLocalDateTime(),
        calificacionLimpieza: Number(calificacionLimpieza),
        estadoCobertura: 'cerrado',
      });
      setClosingTurno(null);
      setMessage('Turno cerrado correctamente.');
      reload();
    } catch {
      setCloseError('No se pudo cerrar el turno. Revisa que la asignacion exista y vuelve a intentar.');
    }
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Mis Turnos" description="Panel semanal del docente actual resuelto por el backend." />
      {message ? <Message>{message}</Message> : null}
      {reminders.length ? (
        <section className="reminder-stack" aria-label="Recordatorios de turno">
          {reminders.map((reminder) => (
            <article key={reminder.key} className={reminder.minutes === 5 ? 'turno-reminder urgent' : 'turno-reminder'}>
              <AlertTriangle size={20} />
              <div>
                <strong>Recordatorio de {reminder.minutes} minutos</strong>
                <span>Inicia a las {formatTime(reminder.turno.horaInicio)} - {reminder.turno.zona}</span>
              </div>
              <Link className="btn btn-primary" to={`/check-in-punto?asignacionId=${reminder.turno.asignacionId}`}>
                Abrir turno
              </Link>
            </article>
          ))}
        </section>
      ) : null}
      {recorridoConfirmations.length ? (
        <section className="reminder-stack" aria-label="Confirmaciones de recorrido">
          {recorridoConfirmations.map((confirmation) => (
            <article key={confirmation.key} className="turno-reminder evidence">
              <ClipboardCheck size={20} />
              <div>
                <strong>Confirma recorrido</strong>
                <span>
                  {confirmation.turno.zona} lleva {confirmation.minutesWithoutEvidence} min sin evidencia reciente
                </span>
              </div>
              <Link className="btn btn-primary" to={`/registrar-punto?asignacionId=${confirmation.turno.asignacionId}`}>
                Registrar checkpoint
              </Link>
            </article>
          ))}
        </section>
      ) : null}
      <section className="stats-grid">
        <StatCard icon={<CalendarCheck />} label="Turnos de la semana" value={data?.resumen?.totalTurnosSemana || 0} />
        <StatCard icon={<CheckCircle2 />} label="Completados" value={data?.resumen?.turnosCompletados || 0} tone="green" />
        <StatCard icon={<ShieldCheck />} label="Proximo" value={data?.resumen?.proximoTurno || 'Sin turnos'} tone="orange" />
      </section>
      <div className="week-grid">
        {asArray(data?.vistaSemanal).map((dia) => (
          <article key={dia.fecha} className={dia.cantidadTurnos ? 'week-day active' : 'week-day'}>
            <strong>{dia.etiqueta}</strong>
            <span>{dia.cantidadTurnos} turnos</span>
          </article>
        ))}
      </div>
      <DataTable
        rows={turnos}
        columns={[
          { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
          { key: 'horario', header: 'Horario', render: (row) => `${formatTime(row.horaInicio)} - ${formatTime(row.horaFin)}` },
          { key: 'zona', header: 'Zona' },
          { key: 'estado', header: 'Estado', render: (row) => {
            const state = getDocenteTurnoState(row, now);
            return <span className={`badge ${state.key}`}>{state.label}</span>;
          } },
          { key: 'acciones', header: 'Acciones', render: (row) => (
            <MisTurnosActions turno={row} state={getDocenteTurnoState(row, now)} onCloseTurno={() => openCloseTurno(row)} />
          ) },
        ]}
      />
      {closingTurno ? (
        <Modal title="Cerrar turno" onClose={cancelCloseTurno}>
          <form className="grid-form" onSubmit={closeTurno}>
            <p className="form-note">
              {closingTurno.zona} - {formatDate(closingTurno.fecha)} {formatTime(closingTurno.horaInicio)}
            </p>
            <FormField label="Calificacion de limpieza" name="calificacionLimpieza">
              <select name="calificacionLimpieza" defaultValue="" required>
                <option value="">Seleccionar</option>
                <option value="1">1 - limpio</option>
                <option value="2">2 - algo de basura</option>
                <option value="3">3 - mucha basura</option>
                <option value="4">4 - critico</option>
              </select>
            </FormField>
            {closeError ? <Message type="error">{closeError}</Message> : null}
            <Button type="submit"><CheckCircle2 size={16} />Cerrar turno</Button>
          </form>
        </Modal>
      ) : null}
    </>
  );
}

function MisTurnosActions({ turno, state, onCloseTurno }) {
  const asignacionParam = `asignacionId=${turno.asignacionId}`;
  const turnoParam = `turnoId=${turno.turnoId}`;
  const canCheckin = Boolean(state.canCheckin);
  const canWorkTurno = Boolean(state.canWorkTurno);
  const canRequestReplacement = Boolean(state.canRequestReplacement);

  return (
    <div className="row-actions">
      {canCheckin ? <Link className="table-link" to={`/check-in-punto?${asignacionParam}`}>Iniciar vigilancia</Link> : null}
      {canWorkTurno ? <Link className="table-link" to={`/registrar-punto?${asignacionParam}`}>Registrar recorrido</Link> : null}
      {canWorkTurno ? <Link className="table-link" to={`/reportar-incidente?${asignacionParam}`}>Reportar situacion</Link> : null}
      {canRequestReplacement ? <Link className="table-link" to={`/solicitar-reemplazo?${turnoParam}`}>No puedo llegar al turno</Link> : null}
      {canWorkTurno ? <Button variant="ghost" onClick={onCloseTurno}>Cerrar turno</Button> : null}
      {!canCheckin && !canWorkTurno && !canRequestReplacement ? <span className="muted-action">Sin acciones</span> : null}
    </div>
  );
}

export function RegistrarPuntoPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const { data, loading, error, reload } = useAsync(async () => {
    const [panel, checkpoints] = await Promise.all([asignacionesService.panelActual(), checkpointsService.list()]);
    return { panel, checkpoints: asArray(checkpoints) };
  }, []);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const asignacionId = Number(getFormValue(form, 'asignacionId'));
    const checkpointId = Number(getFormValue(form, 'checkpointId'));
    await recorridosService.create({ asignacionId, checkpointId, fechaHora: nowLocalDateTime() });
    setMessage('Punto de recorrido registrado.');
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Registrar Punto" description="Registra recorridos contra asignaciones y checkpoints reales." />
      {message ? <Message>{message}</Message> : null}
      <form className="form-card wide" onSubmit={submit}>
        <FormField label="Turno asignado" name="asignacionId">
          <select name="asignacionId" defaultValue={searchParams.get('asignacionId') || ''} required>
            <option value="">Seleccionar</option>
            {asArray(data.panel?.turnos).map((turno) => (
              <option key={turno.asignacionId} value={turno.asignacionId}>{turno.zona} - {formatDate(turno.fecha)} {formatTime(turno.horaInicio)}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Checkpoint" name="checkpointId">
          <select name="checkpointId" required>
            {data.checkpoints.map((checkpoint) => <option key={checkpoint.id} value={checkpoint.id}>{checkpoint.nombre}</option>)}
          </select>
        </FormField>
        <Button type="submit"><ClipboardCheck size={16} />Registrar recorrido</Button>
      </form>
    </>
  );
}

export function CheckInPuntoPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const [selectedAsignacionId, setSelectedAsignacionId] = useState(searchParams.get('asignacionId') || '');
  const [selectedCheckpointId, setSelectedCheckpointId] = useState('');
  const [pin, setPin] = useState('');
  const { data, loading, error } = useAsync(async () => {
    const [panel, checkpoints] = await Promise.all([asignacionesService.panelActual(), checkpointsService.list()]);
    return { panel, checkpoints: asArray(checkpoints) };
  }, []);

  useEffect(() => {
    if (!selectedCheckpointId && data?.checkpoints?.length) {
      setSelectedCheckpointId(String(data.checkpoints[0].id));
    }
  }, [data, selectedCheckpointId]);

  async function submit(event) {
    event.preventDefault();
    await submitCheckin(pin, 'Check-in registrado.');
  }

  async function submitCheckin(pinValue, successMessage) {
    if (!selectedAsignacionId || !selectedCheckpointId || !pinValue) {
      setMessage({ type: 'error', text: 'Selecciona asignacion, checkpoint y PIN.' });
      return;
    }

    try {
      await asignacionesService.checkin(Number(selectedAsignacionId), {
        checkpointId: Number(selectedCheckpointId),
        pin: pinValue,
      });
      setMessage({ type: 'success', text: successMessage });
    } catch {
      setMessage({ type: 'error', text: 'No se pudo registrar el check-in. Revisa la ventana horaria y vuelve a intentar.' });
    }
  }

  async function simulateQrScan() {
    const demoPin = generateDemoCheckinPin(selectedCheckpointId);
    setPin(demoPin);
    await submitCheckin(demoPin, 'QR simulado validado. Check-in registrado.');
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Check-in de Punto" description="Valida PIN dinamico en el backend y marca cobertura de asignacion." />
      {message ? <Message type={message.type}>{message.text}</Message> : null}
      <form className="form-card wide" onSubmit={submit}>
        <p className="form-note">Modo demo: puedes escribir el PIN manualmente o usar el escaneo QR simulado.</p>
        <FormField label="Asignacion" name="asignacionId">
          <select name="asignacionId" value={selectedAsignacionId} onChange={(event) => setSelectedAsignacionId(event.target.value)} required>
            <option value="">Seleccionar</option>
            {asArray(data.panel?.turnos).map((turno) => (
              <option key={turno.asignacionId} value={turno.asignacionId}>{turno.zona} - {formatDate(turno.fecha)}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Checkpoint" name="checkpointId">
          <select name="checkpointId" value={selectedCheckpointId} onChange={(event) => setSelectedCheckpointId(event.target.value)} required>
            {data.checkpoints.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}
          </select>
        </FormField>
        <FormField label="PIN" name="pin">
          <input name="pin" value={pin} onChange={(event) => setPin(event.target.value)} required />
        </FormField>
        <div className="row-actions">
          <Button type="submit"><ShieldCheck size={16} />Confirmar check-in</Button>
          <Button type="button" variant="success" onClick={simulateQrScan}><ClipboardCheck size={16} />Simular escaneo QR</Button>
        </div>
      </form>
    </>
  );
}

export function ReportarIncidentePage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const { data, loading, error } = useAsync(() => asignacionesService.panelActual(), []);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    await incidentesService.create({
      tipo: getFormValue(form, 'tipo'),
      severidad: getFormValue(form, 'severidad'),
      descripcion: getFormValue(form, 'descripcion'),
      ubicacion: getFormValue(form, 'ubicacion'),
      asignacionId: Number(getFormValue(form, 'asignacionId')),
      estado: 'reportado',
      fechaHora: nowLocalDateTime(),
    });
    form.reset();
    setMessage('Incidente reportado.');
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Reportar Incidente" description="Crea incidentes reales en /api/v1/incidentes." />
      {message ? <Message>{message}</Message> : null}
      <form className="form-card wide" onSubmit={submit}>
        <FormField label="Asignacion" name="asignacionId">
          <select name="asignacionId" defaultValue={searchParams.get('asignacionId') || ''} required>
            <option value="">Seleccionar</option>
            {asArray(data?.turnos).map((turno) => <option key={turno.asignacionId} value={turno.asignacionId}>{turno.zona} - {formatDate(turno.fecha)}</option>)}
          </select>
        </FormField>
        <FormField label="Tipo" name="tipo" defaultValue="ACCIDENTE" required />
        <FormField label="Severidad" name="severidad">
          <select name="severidad" defaultValue="media"><option>baja</option><option>media</option><option>alta</option><option>critica</option></select>
        </FormField>
        <FormField label="Ubicacion" name="ubicacion" required />
        <label className="field full"><span>Descripcion</span><textarea name="descripcion" required /></label>
        <Button type="submit"><AlertTriangle size={16} />Reportar</Button>
      </form>
    </>
  );
}

export function SolicitarReemplazoPage() {
  const [searchParams] = useSearchParams();
  const [turnoId, setTurnoId] = useState(searchParams.get('turnoId') || '');
  const [candidatos, setCandidatos] = useState([]);
  const [message, setMessage] = useState(null);
  const { data, loading, error } = useAsync(() => asignacionesService.panelActual(), []);

  useEffect(() => {
    let active = true;
    async function loadCandidates() {
      const result = turnoId ? asArray(await reasignacionesService.candidatos(turnoId)) : [];
      if (active) setCandidatos(result);
    }
    loadCandidates();
    return () => {
      active = false;
    };
  }, [turnoId]);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    await reasignacionesService.create({
      turnoId: Number(turnoId),
      motivo: getFormValue(form, 'motivo'),
      docenteReemplazoId: getFormValue(form, 'docenteReemplazoId') ? Number(getFormValue(form, 'docenteReemplazoId')) : null,
    });
    setMessage('Solicitud de reemplazo creada.');
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Solicitar Reemplazo" description="Genera solicitudes de reasignacion con candidatos calculados por la API." />
      {message ? <Message>{message}</Message> : null}
      <form className="form-card wide" onSubmit={submit}>
        <FormField label="Turno" name="turnoId">
          <select name="turnoId" value={turnoId} onChange={(event) => setTurnoId(event.target.value)} required>
            <option value="">Seleccionar turno</option>
            {asArray(data?.turnos).map((turno) => <option key={turno.turnoId} value={turno.turnoId}>{turno.zona} - {formatDate(turno.fecha)} {formatTime(turno.horaInicio)}</option>)}
          </select>
        </FormField>
        <FormField label="Docente reemplazo sugerido" name="docenteReemplazoId">
          <select name="docenteReemplazoId">
            <option value="">Sin sugerencia</option>
            {candidatos.map((docente) => <option key={docente.id} value={docente.id}>{docente.usuario?.nombre}</option>)}
          </select>
        </FormField>
        <label className="field full"><span>Motivo</span><textarea name="motivo" required /></label>
        <Button type="submit"><RefreshCw size={16} />Solicitar</Button>
      </form>
    </>
  );
}
// modificaciones para persona 3, se agrega el Tablero de Coordinacion que muestra informacion relevante para el coordinador sobre turnos activos, solicitudes pendientes e historial de reasignaciones, ademas de filtros y acciones para gestionar las solicitudes de reemplazo.
export function TableroCoordinacionPage() {
  const [filters, setFilters] = useState({ zona: '', franja: '' });
  const [selectedCandidates, setSelectedCandidates] = useState({});

  const { data, loading, error, reload } = useAsync(async () => {
    const [activas, pendientes, historial, zonas] = await Promise.all([
      asignacionesService.activas(),
      reasignacionesService.byEstado('pendiente'),
      reasignacionesService.list(),
      zonasService.list(),
    ]);

    const candidatosEntries = await Promise.all(
      asArray(pendientes).map(async (row) => {
        if (!row.turnoId) return [row.id, []];
        const candidatos = await reasignacionesService.candidatos(row.turnoId);
        return [row.id, asArray(candidatos)];
      })
    );

    return {
      activas: asArray(activas),
      pendientes: asArray(pendientes),
      historial: asArray(historial),
      zonas: asArray(zonas),
      candidatosPorSolicitud: Object.fromEntries(candidatosEntries),
    };
  }, []);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateCandidate(rowId, docenteId) {
    setSelectedCandidates((current) => ({ ...current, [rowId]: docenteId }));
  }

  async function responder(row, decision) {
    const docenteReemplazoId = selectedCandidates[row.id] || row.docenteReemplazoId || null;

    if (decision === 'aceptada' && !docenteReemplazoId) {
      alert('Selecciona un docente reemplazo antes de aceptar la solicitud.');
      return;
    }

    await reasignacionesService.responder(row.id, {
      decision,
      docenteReemplazoId: decision === 'aceptada' ? docenteReemplazoId : null,
    });

    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const turnosFiltrados = asArray(data?.activas).filter((row) => {
    const matchesZona = !filters.zona || row.zona === filters.zona;
    const matchesFranja = !filters.franja || getFranja(row.horaInicio) === filters.franja;
    return matchesZona && matchesFranja;
  });

  const historialOrdenado = [...asArray(data?.historial)]
    .sort((a, b) => String(b.fechaSolicitud || '').localeCompare(String(a.fechaSolicitud || '')))
    .slice(0, 10);

  return (
    <>
      <PageHeader
        title="Tablero de Coordinación"
        description="Turnos activos, reemplazos pendientes y trazabilidad de reasignaciones."
        action={<Button variant="ghost" onClick={reload}><RefreshCw size={16} />Actualizar</Button>}
      />

      <section className="stats-grid">
        <StatCard icon={<ShieldCheck />} label="Turnos activos" value={asArray(data?.activas).length} tone="green" />
        <StatCard icon={<RefreshCw />} label="Solicitudes pendientes" value={asArray(data?.pendientes).length} tone="orange" />
        <StatCard icon={<ClipboardCheck />} label="Historial" value={asArray(data?.historial).length} />
      </section>

      <section className="filter-row">
        <select name="zona" value={filters.zona} onChange={updateFilter}>
          <option value="">Todas las zonas</option>
          {asArray(data?.zonas).map((zona) => (
            <option key={zona.id} value={zona.nombre}>{zona.nombre}</option>
          ))}
        </select>

        <select name="franja" value={filters.franja} onChange={updateFilter}>
          <option value="">Todas las franjas</option>
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>

        <Button variant="ghost" onClick={() => setFilters({ zona: '', franja: '' })}>
          Limpiar filtros
        </Button>
      </section>

      <h2 className="section-title">Cobertura operativa</h2>
      <DataTable
        rows={turnosFiltrados.map((row) => ({ ...row, id: row.asignacionId }))}
        columns={[
          { key: 'docenteNombre', header: 'Docente' },
          { key: 'zona', header: 'Zona' },
          { key: 'horaInicio', header: 'Inicio' },
          { key: 'estado', header: 'Estado', render: (row) => <span className="badge cubierta">{row.estado}</span> },
          {
            key: 'acciones',
            header: 'Accesos rápidos',
            render: () => (
              <div className="row-actions">
                <Link className="btn btn-ghost" to="/cobertura">Ver cobertura</Link>
                <Link className="btn btn-ghost" to="/incidentes">Incidentes</Link>
              </div>
            ),
          },
        ]}
      />

      <h2 className="section-title">Solicitudes pendientes</h2>
      <DataTable
        rows={asArray(data?.pendientes)}
        columns={[
          { key: 'docenteNombre', header: 'Solicitante' },
          { key: 'turnoDescripcion', header: 'Turno' },
          { key: 'motivo', header: 'Motivo' },
          {
            key: 'docenteReemplazo',
            header: 'Docente reemplazo',
            render: (row) => (
              <select
                className="mini-select"
                value={selectedCandidates[row.id] || row.docenteReemplazoId || ''}
                onChange={(event) => updateCandidate(row.id, event.target.value)}
              >
                <option value="">Seleccionar candidato</option>
                {asArray(data?.candidatosPorSolicitud?.[row.id]).map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docenteNombre(docente)}
                  </option>
                ))}
              </select>
            ),
          },
          {
            key: 'acciones',
            header: 'Acciones',
            render: (row) => (
              <div className="row-actions">
                <Button variant="success" onClick={() => responder(row, 'aceptada')}>Aceptar</Button>
                <Button variant="danger" onClick={() => responder(row, 'rechazada')}>Rechazar</Button>
              </div>
            ),
          },
        ]}
      />

      <h2 className="section-title">Trazabilidad de reasignaciones</h2>
      <DataTable
        rows={historialOrdenado}
        columns={[
          { key: 'fechaSolicitud', header: 'Solicitud', render: (row) => formatDateTime(row.fechaSolicitud) },
          { key: 'docenteNombre', header: 'Docente original' },
          { key: 'turnoDescripcion', header: 'Turno' },
          { key: 'docenteReemplazoNombre', header: 'Reemplazo' },
          {
            key: 'estado',
            header: 'Estado',
            render: (row) => <span className={`badge ${row.estado}`}>{row.estado}</span>,
          },
          { key: 'fechaRespuesta', header: 'Respuesta', render: (row) => formatDateTime(row.fechaRespuesta) },
          { key: 'aprobador', header: 'Aprobador' },
        ]}
      />
    </>
  );
}

export function AnalyticsPage() {
  const [filters, setFilters] = useState({ rango: '30', tipo: 'Todos' });

  const { data, loading, error, reload } = useAsync(async () => {
    const [heatmap, indicadores, reporteSemanal, gamificacion] = await Promise.all([
      analyticsService.heatmap(filters),
      analyticsService.indicadores({ rango: filters.rango, zonaId: filters.zonaId }),
      analyticsService.reporteSemanal(),
      analyticsService.gamificacion({ rango: filters.rango }),
    ]);

    return {
      heatmap,
      indicadores,
      reporteSemanal,
      gamificacion,
    };
  }, [filters.rango, filters.zonaId, filters.tipo]);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleExportCsv() {
    window.open(analyticsService.exportCsvUrl(filters), '_blank');
  }

  const heatmap = data?.heatmap;
  const indicadores = data?.indicadores;
  const reporteSemanal = data?.reporteSemanal;
  const gamificacion = asArray(data?.gamificacion);

  return (
    <>
      <PageHeader
        title="Analíticas y reportes"
        description="Indicadores operativos, mapas de calor, reporte semanal, gamificación institucional y exportación CSV."
        action={
          <div className="row-actions">
            <Button variant="ghost" onClick={reload}>
              <RefreshCw size={16} />
              Actualizar
            </Button>
            <Button variant="primary" onClick={handleExportCsv}>
              <Save size={16} />
              Exportar CSV
            </Button>
          </div>
        }
      />

      <section className="filter-row">
        <select name="rango" value={filters.rango} onChange={updateFilter}>
          <option value="7">7 días</option>
          <option value="30">30 días</option>
          <option value="90">90 días</option>
          <option value="currentMonth">Mes actual</option>
          <option value="previousMonth">Mes anterior</option>
        </select>

        <select name="zonaId" value={filters.zonaId || ''} onChange={updateFilter}>
          <option value="">Todas las zonas</option>
          {asArray(heatmap?.zonas).map((zona) => (
            <option key={zona.id} value={zona.id}>
              {zona.nombre}
            </option>
          ))}
        </select>

        <select name="tipo" value={filters.tipo} onChange={updateFilter}>
          <option>Todos</option>
          {asArray(heatmap?.tiposIncidente).map((tipo) => (
            <option key={tipo}>{tipo}</option>
          ))}
        </select>
      </section>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <>
          <h2 className="section-title">Indicadores generales</h2>

          <section className="stats-grid">
            <StatCard
              icon={<CheckCircle2 />}
              label="Puntualidad"
              value={`${Math.round(indicadores?.porcentajePuntualidad || 0)}%`}
              tone="green"
            />

            <StatCard
              icon={<ShieldCheck />}
              label="Cobertura"
              value={`${Math.round(indicadores?.porcentajeCobertura || 0)}%`}
              tone="navy"
            />

            <StatCard
              icon={<AlertTriangle />}
              label="Retrasos"
              value={indicadores?.asignacionesConRetraso || 0}
              tone="orange"
            />

            <StatCard
              icon={<ClipboardCheck />}
              label="Recorridos"
              value={indicadores?.totalRecorridos || 0}
              tone="navy"
            />

            <StatCard
              icon={<CalendarCheck />}
              label="Tiempo respuesta prom."
              value={`${Math.round(indicadores?.tiempoRespuestaPromedioMinutos || 0)} min`}
              tone="red"
            />
          </section>

          <h2 className="section-title">Mapa de calor por zona, tipo y franja</h2>

          <section className="stats-grid">
            <StatCard
              icon={<AlertTriangle />}
              label="Incidentes"
              value={heatmap?.resumen?.totalIncidentes || 0}
              tone="red"
            />

            <StatCard
              icon={<MapPinned />}
              label="Zonas con incidentes"
              value={heatmap?.resumen?.zonasConIncidentes || 0}
              tone="orange"
            />

            <StatCard
              icon={<BarChart3 />}
              label="Zona top"
              value={heatmap?.resumen?.zonaTop || 'Sin datos'}
            />
          </section>

          <section className="heat-grid">
            {asArray(heatmap?.filas).map((row) => (
              <article key={`${row.zona}-${row.tipo}`} className="heat-card">
                <strong>{row.zona}</strong>
                <span>{row.tipo}</span>
                <b>{row.cantidadIncidentes}</b>
                <small>{Math.round(row.porcentajeTotal)}% del total</small>
                <small>Mañana: {row.incidentesManana} | Tarde: {row.incidentesTarde}</small>
                <small>Cobertura: {Math.round(row.porcentajeCobertura)}%</small>
              </article>
            ))}
          </section>

          <h2 className="section-title">Reporte semanal</h2>

          <section className="stats-grid">
            <StatCard
              icon={<CalendarCheck />}
              label={`Semana ${reporteSemanal?.semanaInicio || ''} a ${reporteSemanal?.semanaFin || ''}`}
              value={reporteSemanal?.totalTurnos || 0}
            />

            <StatCard
              icon={<ShieldCheck />}
              label="Turnos cubiertos"
              value={reporteSemanal?.turnosCubiertos || 0}
              tone="green"
            />

            <StatCard
              icon={<AlertTriangle />}
              label="Incidentes semana"
              value={reporteSemanal?.totalIncidentes || 0}
              tone="red"
            />

            <StatCard
              icon={<MapPinned />}
              label="Zona más crítica"
              value={reporteSemanal?.zonaMasCritica || 'Sin datos'}
              tone="orange"
            />
          </section>

          <h2 className="section-title">Gamificación institucional</h2>

          <DataTable
            rows={gamificacion}
            empty="Todavía no hay datos de gamificación para el rango seleccionado."
            columns={[
              { key: 'docente', header: 'Docente' },
              { key: 'puntualidad', header: 'Puntualidad' },
              { key: 'recorridos', header: 'Recorridos' },
              { key: 'calidadRegistro', header: 'Calidad registro' },
              { key: 'contribucionPreventiva', header: 'Contribución preventiva' },
              {
                key: 'puntajeTotal',
                header: 'Puntaje total',
                render: (row) => <strong>{row.puntajeTotal}</strong>,
              },
              {
                key: 'reconocimiento',
                header: 'Reconocimiento',
                render: (row) => (
                  <span className="badge cubierta">
                    <Medal size={14} />
                    {row.reconocimiento}
                  </span>
                ),
              },
            ]}
          />
        </>
      )}
    </>
  );
}

//modificar para mostrar turnos en tiempo real con su estado de cobertura, usando colores o iconos para diferenciar entre cubiertos, por iniciar y sin cobertura. Agregar filtros por zona y franja horaria para facilitar la detección de posibles problemas operativos.
export function CoberturaPage() {
  const [filters, setFilters] = useState({ zonaId: '', franja: '' });

  const { data, loading, error, reload } = useAsync(async () => {
    const [turnos, asignaciones, docentes, zonas, recorridos] = await Promise.all([
      turnosService.list(),
      asignacionesService.list(),
      docentesService.list(),
      zonasService.list(),
      recorridosService.list(),
    ]);

    const rows = buildCoverageRows({
      turnos: asArray(turnos),
      asignaciones: asArray(asignaciones),
      docentes: asArray(docentes),
      zonas: asArray(zonas),
      recorridos: asArray(recorridos),
    });

    return { rows, zonas: asArray(zonas) };
  }, []);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  const rows = asArray(data?.rows).filter((row) => {
    const matchesZona = !filters.zonaId || String(row.zonaId) === String(filters.zonaId);
    const matchesFranja = !filters.franja || row.franja === filters.franja;
    return matchesZona && matchesFranja;
  });

  const cubiertas = rows.filter((row) => row.estadoClass === 'cubierta').length;
  const porIniciar = rows.filter((row) => row.estadoClass === 'por-iniciar').length;
  const sinCobertura = rows.filter((row) => row.estadoClass === 'sin-cobertura').length;

  return (
    <>
      <PageHeader
        title="Cobertura en Tiempo Real"
        description="Vista operativa para detectar turnos cubiertos, por iniciar o sin cobertura."
        action={<Button variant="ghost" onClick={reload}><RefreshCw size={16} />Actualizar</Button>}
      />

      <section className="stats-grid">
        <StatCard icon={<ShieldCheck />} label="Cubierta" value={cubiertas} tone="green" />
        <StatCard icon={<CalendarCheck />} label="Por iniciar" value={porIniciar} tone="orange" />
        <StatCard icon={<AlertTriangle />} label="Sin cobertura" value={sinCobertura} tone="red" />
      </section>

      <section className="filter-row">
        <select name="zonaId" value={filters.zonaId} onChange={updateFilter}>
          <option value="">Todas las zonas</option>
          {asArray(data?.zonas).map((zona) => (
            <option key={zona.id} value={zona.id}>{zona.nombre}</option>
          ))}
        </select>

        <select name="franja" value={filters.franja} onChange={updateFilter}>
          <option value="">Todas las franjas</option>
          <option value="manana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>

        <Button variant="ghost" onClick={() => setFilters({ zonaId: '', franja: '' })}>
          Limpiar filtros
        </Button>
      </section>

      <DataTable
        rows={rows}
        columns={[
          { key: 'docenteNombre', header: 'Docente' },
          { key: 'zona', header: 'Zona' },
          { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
          { key: 'horaInicio', header: 'Inicio', render: (row) => formatTime(row.horaInicio) },
          {
            key: 'estadoCobertura',
            header: 'Cobertura',
            render: (row) => <span className={`badge ${row.estadoClass}`}>{row.estadoCobertura}</span>,
          },
          { key: 'horaCheckin', header: 'Check-in', render: (row) => formatHourFromDateTime(row.horaCheckin) },
          { key: 'estadoRecorrido', header: 'Recorrido' },
          { key: 'alerta', header: 'Alerta' },
          {
            key: 'acciones',
            header: 'Acción',
            render: (row) => (
              <Link className="btn btn-ghost" to="/tablero-coordinacion">
                Reasignar
              </Link>
            ),
          },
        ]}
      />
    </>
  );
}

export function MetricasDocentesPage() {
  const { data, loading, error } = useAsync(async () => {
    const [docentes, asignaciones] = await Promise.all([docentesService.list(), asignacionesService.list()]);
    return { docentes: asArray(docentes), asignaciones: asArray(asignaciones) };
  }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  const rows = data.docentes.map((docente) => {
    const asignacionesDocente = data.asignaciones.filter((asignacion) => asignacion.docenteId === docente.id);
    const completadas = asignacionesDocente.filter((asignacion) => asignacion.horaCierre).length;
    return { id: docente.id, nombre: docente.usuario?.nombre, codigo: docente.codigoInstitucional, turnos: asignacionesDocente.length, completadas };
  });
  return (
    <>
      <PageHeader title="Metricas Docentes" description="Indicadores derivados de docentes y asignaciones reales." />
      <DataTable rows={rows} columns={[
        { key: 'nombre', header: 'Docente' },
        { key: 'codigo', header: 'Codigo' },
        { key: 'turnos', header: 'Turnos asignados' },
        { key: 'completadas', header: 'Completados' },
      ]} />
    </>
  );
}

export function ReconocimientosPage() {
  const { data, loading, error } = useAsync(async () => {
    const [docentes, asignaciones] = await Promise.all([docentesService.list(), asignacionesService.list()]);
    return asArray(docentes).map((docente) => {
      const scores = asArray(asignaciones).filter((a) => a.docenteId === docente.id && a.calificacionLimpieza);
      const avg = scores.length ? scores.reduce((sum, a) => sum + a.calificacionLimpieza, 0) / scores.length : 0;
      return { id: docente.id, nombre: docente.usuario?.nombre, codigo: docente.codigoInstitucional, promedio: avg.toFixed(1), evaluaciones: scores.length };
    }).sort((a, b) => Number(b.promedio) - Number(a.promedio));
  }, []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return (
    <>
      <PageHeader title="Reconocimientos Institucionales" description="Ranking calculado desde calificaciones de cierre de turno." />
      <DataTable rows={asArray(data)} columns={[
        { key: 'nombre', header: 'Docente' },
        { key: 'codigo', header: 'Codigo' },
        { key: 'promedio', header: 'Promedio limpieza' },
        { key: 'evaluaciones', header: 'Evaluaciones' },
      ]} />
    </>
  );
}

export function ProfilePage({ role = 'ADMIN' }) {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title={`Perfil ${role.toLowerCase()}`} description="Informacion de cuenta disponible en el contexto de la SPA." />
      <section className="profile-card">
        <div className="avatar">{(user?.nombre || role).slice(0, 1)}</div>
        <dl>
          <dt>Nombre</dt><dd>{user?.nombre || 'Usuario local'}</dd>
          <dt>Email</dt><dd>{user?.email || 'Sin email'}</dd>
          <dt>Rol</dt><dd>{user?.rol || role}</dd>
          <dt>Estado</dt><dd>{user?.activo === false ? 'Inactivo' : 'Activo'}</dd>
        </dl>
      </section>
    </>
  );
}

export function ReglasOperativasPage() {
  return (
    <>
      <PageHeader title="Reglas Operativas" description="Lineamientos migrados de la vista informativa anterior." />
      <section className="info-grid">
        <article><h2>Check-in</h2><p>Debe realizarse dentro de la ventana horaria del turno con el PIN del punto de control.</p></article>
        <article><h2>Cierre</h2><p>El cierre requiere estado de cobertura y calificacion de limpieza entre 1 y 4.</p></article>
        <article><h2>Reemplazos</h2><p>Las solicitudes quedan pendientes hasta respuesta de coordinacion.</p></article>
      </section>
    </>
  );
}

export function SoportePage() {
  return (
    <>
      <PageHeader title="Soporte" description="Canales de ayuda para el sistema." />
      <section className="info-grid">
        <article><LifeBuoy /><h2>Mesa de ayuda</h2><p>soporte@sfr.edu.co</p></article>
        <article><ShieldCheck /><h2>Operaciones</h2><p>Reporta fallos de turnos, check-in o asignaciones.</p></article>
      </section>
    </>
  );
}

export function ContactoPage() {
  return (
    <>
      <PageHeader title="Contacto" description="Informacion institucional de contacto." />
      <section className="info-grid">
        <article><Contact /><h2>Correo</h2><p>soporte@sfr.edu.co</p></article>
        <article><MapPinned /><h2>Ubicacion</h2><p>Colegio Santa Francisca Romana</p></article>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <p>La ruta no existe en la SPA.</p>
      <Link to="/dashboard-admin" className="btn btn-primary">Volver al inicio</Link>
    </section>
  );
}
