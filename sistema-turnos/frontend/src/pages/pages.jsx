import { useState } from 'react';
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

function getFormValue(form, name) {
  const value = new FormData(form).get(name);
  return value === '' ? null : value;
}

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
      <PageHeader title="Dashboard Coordinador" description="Seguimiento de cobertura, incidentes y reemplazos." />
      <section className="stats-grid">
        <StatCard icon={<ShieldCheck />} label="Turnos activos" value={data.activas.length} tone="green" />
        <StatCard icon={<RefreshCw />} label="Reemplazos pendientes" value={data.reasignaciones.length} tone="orange" />
        <StatCard icon={<AlertTriangle />} label="Incidentes visibles" value={data.heatmap?.resumen?.totalIncidentes || 0} tone="red" />
      </section>
      <section className="action-grid">
        <Link to="/tablero-coordinacion" className="action-card"><ShieldCheck />Tablero de coordinacion</Link>
        <Link to="/incidentes" className="action-card"><AlertTriangle />Gestionar incidentes</Link>
        <Link to="/analiticas" className="action-card"><BarChart3 />Analiticas</Link>
        <Link to="/reconocimientos" className="action-card"><Medal />Reconocimientos</Link>
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
  const { data, loading, error, reload } = useAsync(() => incidentesService.list(), []);
  const incidentes = asArray(data);

  async function setEstado(incidente, estado) {
    await incidentesService.update(incidente.id, { ...incidente, estado });
    setSelected(null);
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Gestion de Incidentes" description="Consulta y actualizacion del estado de incidentes reportados." />
      <DataTable
        rows={incidentes}
        columns={[
          { key: 'tipo', header: 'Tipo' },
          { key: 'severidad', header: 'Severidad', render: (row) => <span className={`badge ${row.severidad}`}>{row.severidad}</span> },
          { key: 'ubicacion', header: 'Ubicacion' },
          { key: 'estado', header: 'Estado' },
          { key: 'fechaHora', header: 'Fecha', render: (row) => formatDate(row.fechaHora) },
          { key: 'acciones', header: 'Acciones', render: (row) => <Button variant="ghost" onClick={() => setSelected(row)}>Ver detalle</Button> },
        ]}
      />
      {selected ? (
        <Modal title={`Incidente #${selected.id}`} onClose={() => setSelected(null)}>
          <div className="detail-stack">
            <p><strong>Descripcion:</strong> {selected.descripcion}</p>
            <p><strong>Asignacion:</strong> {selected.asignacionId || 'Sin asignacion'}</p>
            <div className="row-actions">
              <Button onClick={() => setEstado(selected, 'en_revision')}>En revision</Button>
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
  const { data, loading, error } = useAsync(() => asignacionesService.panelActual(), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Mis Turnos" description="Panel semanal del docente actual resuelto por el backend." />
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
        rows={asArray(data?.turnos)}
        columns={[
          { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
          { key: 'horario', header: 'Horario', render: (row) => `${formatTime(row.horaInicio)} - ${formatTime(row.horaFin)}` },
          { key: 'zona', header: 'Zona' },
          { key: 'estado', header: 'Estado' },
          { key: 'acciones', header: 'Acciones', render: (row) => <Link className="table-link" to={`/check-in-punto?asignacionId=${row.asignacionId}`}>Check-in</Link> },
        ]}
      />
    </>
  );
}

export function RegistrarPuntoPage() {
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
          <select name="asignacionId" required>
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
  const { data, loading, error } = useAsync(async () => {
    const [panel, checkpoints] = await Promise.all([asignacionesService.panelActual(), checkpointsService.list()]);
    return { panel, checkpoints: asArray(checkpoints) };
  }, []);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const asignacionId = Number(getFormValue(form, 'asignacionId'));
    const payload = { checkpointId: Number(getFormValue(form, 'checkpointId')), pin: getFormValue(form, 'pin') };
    await asignacionesService.checkin(asignacionId, payload);
    setMessage('Check-in registrado.');
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Check-in de Punto" description="Valida PIN dinamico en el backend y marca cobertura de asignacion." />
      {message ? <Message>{message}</Message> : null}
      <form className="form-card wide" onSubmit={submit}>
        <FormField label="Asignacion" name="asignacionId">
          <select name="asignacionId" defaultValue={searchParams.get('asignacionId') || ''} required>
            <option value="">Seleccionar</option>
            {asArray(data.panel?.turnos).map((turno) => (
              <option key={turno.asignacionId} value={turno.asignacionId}>{turno.zona} - {formatDate(turno.fecha)}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Checkpoint" name="checkpointId">
          <select name="checkpointId" required>{data.checkpoints.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select>
        </FormField>
        <FormField label="PIN" name="pin" required />
        <Button type="submit"><ShieldCheck size={16} />Confirmar check-in</Button>
      </form>
    </>
  );
}

export function ReportarIncidentePage() {
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
          <select name="asignacionId" required>
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
  const [turnoId, setTurnoId] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [message, setMessage] = useState(null);
  const { data, loading, error } = useAsync(() => asignacionesService.panelActual(), []);

  async function loadCandidates(value) {
    setTurnoId(value);
    setCandidatos(value ? asArray(await reasignacionesService.candidatos(value)) : []);
  }

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
          <select name="turnoId" value={turnoId} onChange={(event) => loadCandidates(event.target.value)} required>
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

export function TableroCoordinacionPage() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [activas, pendientes] = await Promise.all([asignacionesService.activas(), reasignacionesService.byEstado('pendiente')]);
    return { activas: asArray(activas), pendientes: asArray(pendientes) };
  }, []);

  async function responder(row, decision) {
    await reasignacionesService.responder(row.id, { decision, docenteReemplazoId: row.docenteReemplazoId });
    reload();
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <PageHeader title="Tablero de Coordinacion" description="Turnos activos y solicitudes de reemplazo pendientes." />
      <DataTable rows={data.activas} columns={[
        { key: 'docenteNombre', header: 'Docente' },
        { key: 'zona', header: 'Zona' },
        { key: 'horaInicio', header: 'Inicio' },
        { key: 'estado', header: 'Estado' },
      ]} />
      <h2 className="section-title">Solicitudes pendientes</h2>
      <DataTable rows={data.pendientes} columns={[
        { key: 'docenteNombre', header: 'Solicitante' },
        { key: 'turnoDescripcion', header: 'Turno' },
        { key: 'motivo', header: 'Motivo' },
        { key: 'acciones', header: 'Acciones', render: (row) => <div className="row-actions"><Button variant="success" onClick={() => responder(row, 'aceptada')}>Aceptar</Button><Button variant="danger" onClick={() => responder(row, 'rechazada')}>Rechazar</Button></div> },
      ]} />
    </>
  );
}

export function AnalyticsPage() {
  const [filters, setFilters] = useState({ rango: '7', tipo: 'Todos' });
  const { data, loading, error, reload } = useAsync(() => analyticsService.heatmap(filters), [filters.rango, filters.zonaId, filters.tipo]);

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <>
      <PageHeader title="Analiticas" description="Mapa de calor de incidentes consumido desde /api/v1/analiticas/mapa-calor." action={<Button variant="ghost" onClick={reload}><RefreshCw size={16} />Actualizar</Button>} />
      <section className="filter-row">
        <select name="rango" value={filters.rango} onChange={updateFilter}><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option></select>
        <select name="zonaId" value={filters.zonaId || ''} onChange={updateFilter}><option value="">Todas las zonas</option>{asArray(data?.zonas).map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}</select>
        <select name="tipo" value={filters.tipo} onChange={updateFilter}><option>Todos</option>{asArray(data?.tiposIncidente).map((tipo) => <option key={tipo}>{tipo}</option>)}</select>
      </section>
      {loading ? <LoadingState /> : error ? <ErrorState error={error} /> : (
        <>
          <section className="stats-grid">
            <StatCard icon={<AlertTriangle />} label="Incidentes" value={data?.resumen?.totalIncidentes || 0} tone="red" />
            <StatCard icon={<MapPinned />} label="Zonas con incidentes" value={data?.resumen?.zonasConIncidentes || 0} tone="orange" />
            <StatCard icon={<BarChart3 />} label="Zona top" value={data?.resumen?.zonaTop || 'Sin datos'} />
          </section>
          <section className="heat-grid">
            {asArray(data?.filas).map((row) => (
              <article key={`${row.zona}-${row.tipo}`} className="heat-card">
                <strong>{row.zona}</strong>
                <span>{row.tipo}</span>
                <b>{row.cantidadIncidentes}</b>
                <small>{Math.round(row.porcentajeTotal)}% del total</small>
              </article>
            ))}
          </section>
        </>
      )}
    </>
  );
}

export function CoberturaPage() {
  const { data, loading, error } = useAsync(() => asignacionesService.activas(), []);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  return (
    <>
      <PageHeader title="Cobertura en Tiempo Real" description="Turnos activos con check-in registrado y sin cierre." />
      <DataTable rows={asArray(data)} columns={[
        { key: 'docenteNombre', header: 'Docente' },
        { key: 'zona', header: 'Zona' },
        { key: 'horaInicio', header: 'Inicio' },
        { key: 'estado', header: 'Estado' },
      ]} />
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
        <article><h2>Cierre</h2><p>El cierre requiere estado de cobertura y calificacion de limpieza entre 1 y 5.</p></article>
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
