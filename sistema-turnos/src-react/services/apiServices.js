import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }
  return config
})

const normalizeRole = (role = '') => {
  const upperRole = String(role).toUpperCase()
  if (upperRole === 'ADMIN') return 'admin'
  if (upperRole === 'DOCENTE' || upperRole === 'PROFESOR') return 'profesor'
  if (upperRole === 'COORDINADOR') return 'coordinador'
  return String(role).toLowerCase()
}

const shortTime = (value) => (value ? String(value).slice(0, 5) : '')
const asResponse = (data) => ({ data })
const safeArray = (value) => (Array.isArray(value) ? value : [])
const toMapById = (items) => new Map(safeArray(items).map((item) => [item.id, item]))

const formatDateTime = (value) => {
  if (!value) return 'Sin registro'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin registro'

  return date.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const getDocenteNombre = (docente) => docente?.usuario?.nombre || `Docente ${docente?.id || ''}`.trim()
const getDocenteEmail = (docente) => docente?.usuario?.email || ''

const pickLatest = (items, getDateValue) =>
  safeArray(items).reduce((latest, current) => {
    if (!latest) return current
    return new Date(getDateValue(current) || 0) > new Date(getDateValue(latest) || 0) ? current : latest
  }, null)

const rawGet = async (endpoint, config = {}) => {
  const response = await client.get(endpoint, config)
  return response.data
}

const buildTurnoView = (turno, zonaMap, asignacionByTurnoId, docenteMap) => {
  const zona = zonaMap.get(turno.zonaId) || null
  const asignacion = asignacionByTurnoId.get(turno.id) || null
  const docente = asignacion ? docenteMap.get(asignacion.docenteId) || null : null
  const profesorNombre = docente ? getDocenteNombre(docente) : 'Sin asignar'
  const cobertura = asignacion?.estadoCobertura === 'COMPLETA' ? 'COMPLETA' : 'INCOMPLETA'
  const turnoActivo = turno.estado === 'ACTIVO' || asignacion?.estadoCobertura === 'EN_CURSO'

  return {
    ...turno,
    horaInicio: shortTime(turno.horaInicio),
    horaFin: shortTime(turno.horaFin),
    zona,
    zonaNombre: zona?.nombre || 'Sin zona',
    profesor: profesorNombre,
    profesorNombre,
    docente: docente
      ? {
          id: docente.id,
          nombre: profesorNombre,
          email: getDocenteEmail(docente),
        }
      : null,
    asignacionId: asignacion?.id || null,
    estadoCobertura: asignacion?.estadoCobertura || 'PENDIENTE',
    cobertura,
    turnoActivo,
    ultimoCheckpoint: formatDateTime(asignacion?.horaCheckin || asignacion?.horaCierre),
  }
}

export const ApiClient = {
  get: (endpoint, config = {}) => client.get(endpoint, config),
  post: (endpoint, data, config = {}) => client.post(endpoint, data, config),
  put: (endpoint, data, config = {}) => client.put(endpoint, data, config),
  delete: (endpoint, config = {}) => client.delete(endpoint, config),
}

export const UsuarioService = {
  obtenerTodos: async () => {
    const usuarios = safeArray(await rawGet('/v1/usuarios'))

    return asResponse(
      usuarios.map((usuario) => ({
        ...usuario,
        rol: normalizeRole(usuario.rol),
      }))
    )
  },
  obtenerPorId: (id) => ApiClient.get(`/v1/usuarios/${id}`),
  crear: (data) => ApiClient.post('/v1/usuarios', data),
  actualizar: (id, data) => ApiClient.put(`/v1/usuarios/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/usuarios/${id}`),
}

export const DocenteService = {
  obtenerTodos: async () => {
    const [docentes, turnos, zonas, asignaciones] = await Promise.all([
      rawGet('/v1/docentes'),
      rawGet('/v1/turnos'),
      rawGet('/v1/zonas'),
      rawGet('/v1/asignaciones-turnos'),
    ])

    const turnoMap = toMapById(turnos)
    const zonaMap = toMapById(zonas)
    const asignacionesPorDocente = safeArray(asignaciones).reduce((acc, asignacion) => {
      acc.set(asignacion.docenteId, [...(acc.get(asignacion.docenteId) || []), asignacion])
      return acc
    }, new Map())

    const data = safeArray(docentes).map((docente) => {
      const relacionadas = asignacionesPorDocente.get(docente.id) || []
      const zonasAsignadas = [
        ...new Set(
          relacionadas
            .map((asignacion) => turnoMap.get(asignacion.turnoId))
            .filter(Boolean)
            .map((turno) => zonaMap.get(turno.zonaId)?.nombre)
            .filter(Boolean)
        ),
      ]

      return {
        ...docente,
        nombre: getDocenteNombre(docente),
        email: getDocenteEmail(docente),
        activo: docente?.usuario?.activo ?? false,
        rol: normalizeRole(docente?.usuario?.rol),
        zona: zonasAsignadas.join(', ') || 'Sin asignar',
        zonas: zonasAsignadas,
      }
    })

    return asResponse(data)
  },
  obtenerPorId: (id) => ApiClient.get(`/v1/docentes/${id}`),
  crear: (data) => ApiClient.post('/v1/docentes', data),
  actualizar: (id, data) => ApiClient.put(`/v1/docentes/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/docentes/${id}`),
}

export const TurnoService = {
  obtenerTodos: async () => {
    const [turnos, zonas, docentes, asignaciones] = await Promise.all([
      rawGet('/v1/turnos'),
      rawGet('/v1/zonas'),
      rawGet('/v1/docentes'),
      rawGet('/v1/asignaciones-turnos'),
    ])

    const zonaMap = toMapById(zonas)
    const docenteMap = toMapById(docentes)
    const asignacionByTurnoId = new Map(safeArray(asignaciones).map((asignacion) => [asignacion.turnoId, asignacion]))

    return asResponse(
      safeArray(turnos).map((turno) => buildTurnoView(turno, zonaMap, asignacionByTurnoId, docenteMap))
    )
  },
  obtenerPorId: (id) => ApiClient.get(`/v1/turnos/${id}`),
  obtenerPorFecha: (fecha) => ApiClient.get(`/v1/turnos/fecha/${fecha}`),
  obtenerPorEstado: (estado) => ApiClient.get(`/v1/turnos/estado/${estado}`),
  crear: (data) => ApiClient.post('/v1/turnos', data),
  actualizar: (id, data) => ApiClient.put(`/v1/turnos/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/turnos/${id}`),
}

export const ZonaService = {
  obtenerTodos: async () => {
    const [zonas, turnos, asignaciones, docentes] = await Promise.all([
      rawGet('/v1/zonas'),
      rawGet('/v1/turnos'),
      rawGet('/v1/asignaciones-turnos'),
      rawGet('/v1/docentes'),
    ])

    const docenteMap = toMapById(docentes)
    const asignacionByTurnoId = new Map(safeArray(asignaciones).map((asignacion) => [asignacion.turnoId, asignacion]))

    const data = safeArray(zonas).map((zona) => {
      const turnosZona = safeArray(turnos).filter((turno) => turno.zonaId === zona.id)
      const asignacionesZona = turnosZona
        .map((turno) => asignacionByTurnoId.get(turno.id))
        .filter(Boolean)
      const ultimaAsignacion = pickLatest(
        asignacionesZona,
        (asignacion) => asignacion.horaCheckin || asignacion.horaCierre
      )
      const docente = ultimaAsignacion ? docenteMap.get(ultimaAsignacion.docenteId) : null
      const cobertura = asignacionesZona.some((asignacion) => asignacion.estadoCobertura === 'COMPLETA')
        ? 'COMPLETA'
        : 'INCOMPLETA'

      return {
        ...zona,
        profesorAsignado: docente ? getDocenteNombre(docente) : 'Sin asignar',
        responsable: docente ? getDocenteNombre(docente) : 'Sin asignar',
        cobertura,
        turnoActivo: turnosZona.some((turno) => turno.estado === 'ACTIVO'),
        ultimoCheckpoint: formatDateTime(ultimaAsignacion?.horaCheckin || ultimaAsignacion?.horaCierre),
      }
    })

    return asResponse(data)
  },
  obtenerPorId: (id) => ApiClient.get(`/v1/zonas/${id}`),
  crear: (data) => ApiClient.post('/v1/zonas', data),
  actualizar: (id, data) => ApiClient.put(`/v1/zonas/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/zonas/${id}`),
}

export const IncidenteService = {
  obtenerTodos: async () => {
    const [incidentes, asignaciones, turnos, zonas, docentes] = await Promise.all([
      rawGet('/v1/incidentes'),
      rawGet('/v1/asignaciones-turnos'),
      rawGet('/v1/turnos'),
      rawGet('/v1/zonas'),
      rawGet('/v1/docentes'),
    ])

    const asignacionMap = toMapById(asignaciones)
    const turnoMap = toMapById(turnos)
    const zonaMap = toMapById(zonas)
    const docenteMap = toMapById(docentes)

    const data = safeArray(incidentes).map((incidente) => {
      const asignacion = asignacionMap.get(incidente.asignacionId)
      const turno = asignacion ? turnoMap.get(asignacion.turnoId) : null
      const zona = turno ? zonaMap.get(turno.zonaId) : null
      const docente = asignacion ? docenteMap.get(asignacion.docenteId) : null

      return {
        ...incidente,
        prioridad: incidente.severidad,
        estado: 'REGISTRADO',
        ubicacion: zona?.nombre || 'Sin zona',
        responsable: docente ? getDocenteNombre(docente) : 'Sin asignar',
      }
    })

    return asResponse(data)
  },
  obtenerPorId: (id) => ApiClient.get(`/v1/incidentes/${id}`),
  crear: (data) => ApiClient.post('/v1/incidentes', data),
  actualizar: (id, data) => ApiClient.put(`/v1/incidentes/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/incidentes/${id}`),
}

export const AsignacionTurnoService = {
  obtenerTodos: () => ApiClient.get('/v1/asignaciones-turnos'),
  obtenerPorId: (id) => ApiClient.get(`/v1/asignaciones-turnos/${id}`),
  crear: (data) => ApiClient.post('/v1/asignaciones-turnos', data),
  actualizar: (id, data) => ApiClient.put(`/v1/asignaciones-turnos/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/asignaciones-turnos/${id}`),
}

export const ReasignacionService = {
  obtenerTodos: () => ApiClient.get('/v1/reasignaciones'),
  obtenerPorId: (id) => ApiClient.get(`/v1/reasignaciones/${id}`),
  crear: (data) => ApiClient.post('/v1/reasignaciones', data),
  actualizar: (id, data) => ApiClient.put(`/v1/reasignaciones/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/reasignaciones/${id}`),
}

export const RecorridoService = {
  obtenerTodos: () => ApiClient.get('/v1/recorridos'),
  obtenerPorId: (id) => ApiClient.get(`/v1/recorridos/${id}`),
  crear: (data) => ApiClient.post('/v1/recorridos', data),
  actualizar: (id, data) => ApiClient.put(`/v1/recorridos/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/recorridos/${id}`),
}

export const CheckpointService = {
  obtenerTodos: () => ApiClient.get('/v1/checkpoints'),
  obtenerPorId: (id) => ApiClient.get(`/v1/checkpoints/${id}`),
  crear: (data) => ApiClient.post('/v1/checkpoints', data),
  actualizar: (id, data) => ApiClient.put(`/v1/checkpoints/${id}`, data),
  eliminar: (id) => ApiClient.delete(`/v1/checkpoints/${id}`),
}

export const ContactoService = {
  enviar: (data) => ApiClient.post('/contacto', data),
}

export const AuthService = {
  login: async (usuario, contrasena) => {
    const response = await ApiClient.post('/auth/login', { usuario, contrasena })

    if (response.data?.user) {
      response.data.user = {
        ...response.data.user,
        rol: normalizeRole(response.data.user.rol),
      }
    }

    return response
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    if (!user) return null

    const parsedUser = JSON.parse(user)
    return {
      ...parsedUser,
      rol: normalizeRole(parsedUser.rol),
    }
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
}
