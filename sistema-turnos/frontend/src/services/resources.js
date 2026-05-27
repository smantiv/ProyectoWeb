import { http } from './apiClient';
import { API_BASE_URL } from '../config/env';

const crud = (path) => ({
  list: () => http.get(path),
  get: (id) => http.get(`${path}/${id}`),
  create: (payload) => http.post(path, payload),
  update: (id, payload) => http.put(`${path}/${id}`, payload),
  remove: (id) => http.delete(`${path}/${id}`),
});

export const usuariosService = {
  ...crud('/usuarios'),
  byEmail: (email) => http.get(`/usuarios/email/${encodeURIComponent(email)}`),
  byRol: (rol) => http.get(`/usuarios/rol/${rol}`),
};

export const docentesService = {
  ...crud('/docentes'),
  actual: () => http.get('/docentes/actual'),
  byCodigo: (codigo) => http.get(`/docentes/codigo/${encodeURIComponent(codigo)}`),
};

export const zonasService = crud('/zonas');

export const turnosService = {
  ...crud('/turnos'),
  byEstado: (estado) => http.get(`/turnos/estado/${encodeURIComponent(estado)}`),
  byFecha: (fecha) => http.get(`/turnos/fecha/${fecha}`),
  byZona: (zonaId) => http.get(`/turnos/zona/${zonaId}`),
};

export const asignacionesService = {
  ...crud('/asignaciones-turnos'),
  byDocente: (docenteId) => http.get(`/asignaciones-turnos/docente/${docenteId}`),
  panelActual: () => http.get('/asignaciones-turnos/actual/panel'),
  activas: () => http.get('/asignaciones-turnos/activas'),
  checkin: (id, payload) => http.post(`/asignaciones-turnos/${id}/checkin`, payload),
  cierre: (id, payload) => http.post(`/asignaciones-turnos/${id}/cierre`, payload),
};

export const incidentesService = {
  ...crud('/incidentes'),
  byEstado: (estado) => http.get(`/incidentes/estado/${encodeURIComponent(estado)}`),
  byAsignacion: (asignacionId) => http.get(`/incidentes/asignacion/${asignacionId}`),
};

export const checkpointsService = crud('/checkpoints');

export const recorridosService = {
  ...crud('/recorridos'),
  byAsignacion: (asignacionId) => http.get(`/recorridos/asignacion/${asignacionId}`),
};

export const reasignacionesService = {
  ...crud('/reasignaciones'),
  actual: () => http.get('/reasignaciones/actual'),
  byEstado: (estado) => http.get(`/reasignaciones/estado/${encodeURIComponent(estado)}`),
  candidatos: (turnoId) => http.get(`/reasignaciones/candidatos/${turnoId}`),
  responder: (id, payload) => http.put(`/reasignaciones/${id}/responder`, payload),
};

function buildSearch(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });

  return search.toString();
}

export const analyticsService = {
  heatmap: (params = {}) => http.get(`/analiticas/mapa-calor?${buildSearch(params)}`),

  indicadores: (params = {}) => http.get(`/analiticas/indicadores?${buildSearch(params)}`),

  reporteSemanal: () => http.get('/analiticas/reporte-semanal'),

  gamificacion: (params = {}) => http.get(`/analiticas/gamificacion?${buildSearch(params)}`),

  exportCsvUrl: (params = {}) => `${API_BASE_URL}/analiticas/export/csv?${buildSearch(params)}`,
};
