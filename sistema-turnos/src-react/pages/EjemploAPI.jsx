import React, { useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import NavBar from '../components/NavBar'
import { ApiClient } from '../services/apiServices'

const prettyJson = (value) => JSON.stringify(value, null, 2)

const initialUsuarioForm = {
  id: '1',
  email: 'admin@test.com',
  nombre: 'Usuario Demo API',
  nuevoEmail: 'demo.api@example.com',
  rol: 'DOCENTE',
}

const initialTurnoForm = {
  fecha: '2026-03-24',
  estado: 'PENDIENTE',
  zonaId: '1',
}

const initialDocenteForm = {
  codigo: 'DOC001',
}

const initialZonaForm = {
  nombre: 'Zona Demo API',
  descripcion: 'Zona creada desde la pantalla de ejemplo API',
}

const initialAsignacionForm = {
  docenteId: '1',
}

const codeExample = `// Ejemplo usando la API REST real
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

async function pruebaCompleta() {
  const usuarios = await api.get('/usuarios')
  console.log('Usuarios:', usuarios.data)

  const turnoCreado = await api.post('/turnos', {
    fecha: '2026-03-24',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    estado: 'PENDIENTE',
    zonaId: 1
  })
  console.log('Turno creado:', turnoCreado.data)

  const zonas = await api.get('/zonas')
  console.log('Zonas:', zonas.data)
}

pruebaCompleta()`

export const EjemploAPI = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})
  const [usuarioForm, setUsuarioForm] = useState(initialUsuarioForm)
  const [turnoForm, setTurnoForm] = useState(initialTurnoForm)
  const [docenteForm, setDocenteForm] = useState(initialDocenteForm)
  const [zonaForm, setZonaForm] = useState(initialZonaForm)
  const [asignacionForm, setAsignacionForm] = useState(initialAsignacionForm)

  const runRequest = async ({ key, label, method, endpoint, payload, request }) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    setResults((prev) => ({
      ...prev,
      [key]: {
        label,
        status: 'PENDIENTE',
        method,
        endpoint,
        payload,
        body: 'Cargando...',
      },
    }))

    try {
      const response = await request()
      setResults((prev) => ({
        ...prev,
        [key]: {
          label,
          status: response.status,
          method,
          endpoint,
          payload,
          body: response.data,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [key]: {
          label,
          status: error.response?.status || 'ERROR',
          method,
          endpoint,
          payload,
          body: error.response?.data || { message: error.message },
        },
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  const renderResult = (key) => {
    const result = results[key]
    if (!result) return null

    return (
      <div className={`result ${String(result.status).startsWith('2') ? 'success' : 'error'}`} style={{ display: 'block' }}>
        {prettyJson({
          operacion: result.label,
          metodo: result.method,
          endpoint: result.endpoint,
          status: result.status,
          payload: result.payload || null,
          response: result.body,
        })}
      </div>
    )
  }

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
              <h1>Ejemplo para consumir API REST</h1>
              <p>Esta pantalla sirve para comprobar getters, setters, persistencia en base de datos y respuestas JSON reales de Spring Boot.</p>
            </section>

            <div className="container">
              <h2>Servicio de Usuarios</h2>
              <div className="example-form">
                <div className="form-row">
                  <input
                    type="text"
                    value={usuarioForm.id}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, id: e.target.value })}
                    placeholder="ID del usuario"
                  />
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'usuario-id',
                        label: 'Obtener usuario por ID',
                        method: 'GET',
                        endpoint: `/api/v1/usuarios/${usuarioForm.id}`,
                        request: () => ApiClient.get(`/v1/usuarios/${usuarioForm.id}`),
                      })
                    }
                  >
                    {loading['usuario-id'] ? 'Cargando...' : 'Obtener usuario por ID'}
                  </button>
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'usuario-all',
                        label: 'Obtener todos los usuarios',
                        method: 'GET',
                        endpoint: '/api/v1/usuarios',
                        request: () => ApiClient.get('/v1/usuarios'),
                      })
                    }
                  >
                    {loading['usuario-all'] ? 'Cargando...' : 'Obtener todos'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="email"
                    value={usuarioForm.email}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, email: e.target.value })}
                    placeholder="Email"
                  />
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'usuario-email',
                        label: 'Obtener usuario por email',
                        method: 'GET',
                        endpoint: `/api/v1/usuarios/email/${usuarioForm.email}`,
                        request: () => ApiClient.get(`/v1/usuarios/email/${usuarioForm.email}`),
                      })
                    }
                  >
                    {loading['usuario-email'] ? 'Cargando...' : 'Obtener por email'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    value={usuarioForm.nombre}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, nombre: e.target.value })}
                    placeholder="Nombre"
                  />
                  <input
                    type="email"
                    value={usuarioForm.nuevoEmail}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, nuevoEmail: e.target.value })}
                    placeholder="Nuevo email"
                  />
                  <input
                    type="text"
                    value={usuarioForm.rol}
                    onChange={(e) => setUsuarioForm({ ...usuarioForm, rol: e.target.value })}
                    placeholder="Rol"
                  />
                  <button
                    onClick={() => {
                      const payload = {
                        nombre: usuarioForm.nombre,
                        email: usuarioForm.nuevoEmail,
                        password: 'temporal123',
                        rol: usuarioForm.rol,
                        activo: true,
                      }
                      runRequest({
                        key: 'usuario-create',
                        label: 'Crear usuario',
                        method: 'POST',
                        endpoint: '/api/v1/usuarios',
                        payload,
                        request: () => ApiClient.post('/v1/usuarios', payload),
                      })
                    }}
                  >
                    {loading['usuario-create'] ? 'Guardando...' : 'Crear usuario'}
                  </button>
                </div>
              </div>
              {renderResult('usuario-id')}
              {renderResult('usuario-all')}
              {renderResult('usuario-email')}
              {renderResult('usuario-create')}
            </div>

            <div className="container">
              <h2>Servicio de Turnos</h2>
              <div className="example-form">
                <div className="form-row">
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'turnos-all',
                        label: 'Obtener todos los turnos',
                        method: 'GET',
                        endpoint: '/api/v1/turnos',
                        request: () => ApiClient.get('/v1/turnos'),
                      })
                    }
                  >
                    {loading['turnos-all'] ? 'Cargando...' : 'Obtener todos los turnos'}
                  </button>
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'turnos-estado',
                        label: 'Obtener turnos por estado',
                        method: 'GET',
                        endpoint: `/api/v1/turnos/estado/${turnoForm.estado}`,
                        request: () => ApiClient.get(`/v1/turnos/estado/${turnoForm.estado}`),
                      })
                    }
                  >
                    {loading['turnos-estado'] ? 'Cargando...' : 'Obtener por estado'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="date"
                    value={turnoForm.fecha}
                    onChange={(e) => setTurnoForm({ ...turnoForm, fecha: e.target.value })}
                  />
                  <select value={turnoForm.estado} onChange={(e) => setTurnoForm({ ...turnoForm, estado: e.target.value })}>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                  </select>
                  <input
                    type="number"
                    value={turnoForm.zonaId}
                    onChange={(e) => setTurnoForm({ ...turnoForm, zonaId: e.target.value })}
                    placeholder="Zona ID"
                  />
                  <button
                    onClick={() => {
                      const payload = {
                        fecha: turnoForm.fecha,
                        horaInicio: '08:00:00',
                        horaFin: '10:00:00',
                        estado: turnoForm.estado,
                        zonaId: Number(turnoForm.zonaId),
                      }
                      runRequest({
                        key: 'turnos-create',
                        label: 'Crear turno',
                        method: 'POST',
                        endpoint: '/api/v1/turnos',
                        payload,
                        request: () => ApiClient.post('/v1/turnos', payload),
                      })
                    }}
                  >
                    {loading['turnos-create'] ? 'Guardando...' : 'Crear turno'}
                  </button>
                </div>
              </div>
              {renderResult('turnos-all')}
              {renderResult('turnos-estado')}
              {renderResult('turnos-create')}
            </div>

            <div className="container">
              <h2>Servicio de Docentes</h2>
              <div className="example-form">
                <div className="form-row">
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'docentes-all',
                        label: 'Obtener todos los docentes',
                        method: 'GET',
                        endpoint: '/api/v1/docentes',
                        request: () => ApiClient.get('/v1/docentes'),
                      })
                    }
                  >
                    {loading['docentes-all'] ? 'Cargando...' : 'Obtener todos los docentes'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    value={docenteForm.codigo}
                    onChange={(e) => setDocenteForm({ ...docenteForm, codigo: e.target.value })}
                    placeholder="Codigo institucional"
                  />
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'docentes-codigo',
                        label: 'Obtener docente por codigo',
                        method: 'GET',
                        endpoint: `/api/v1/docentes/codigo/${docenteForm.codigo}`,
                        request: () => ApiClient.get(`/v1/docentes/codigo/${docenteForm.codigo}`),
                      })
                    }
                  >
                    {loading['docentes-codigo'] ? 'Cargando...' : 'Obtener por codigo'}
                  </button>
                </div>
              </div>
              {renderResult('docentes-all')}
              {renderResult('docentes-codigo')}
            </div>

            <div className="container">
              <h2>Servicio de Zonas</h2>
              <div className="example-form">
                <div className="form-row">
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'zonas-all',
                        label: 'Obtener todas las zonas',
                        method: 'GET',
                        endpoint: '/api/v1/zonas',
                        request: () => ApiClient.get('/v1/zonas'),
                      })
                    }
                  >
                    {loading['zonas-all'] ? 'Cargando...' : 'Obtener todas las zonas'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    value={zonaForm.nombre}
                    onChange={(e) => setZonaForm({ ...zonaForm, nombre: e.target.value })}
                    placeholder="Nombre de zona"
                  />
                  <input
                    type="text"
                    value={zonaForm.descripcion}
                    onChange={(e) => setZonaForm({ ...zonaForm, descripcion: e.target.value })}
                    placeholder="Descripcion"
                  />
                  <button
                    onClick={() => {
                      const payload = {
                        nombre: zonaForm.nombre,
                        descripcion: zonaForm.descripcion,
                      }
                      runRequest({
                        key: 'zonas-create',
                        label: 'Crear zona',
                        method: 'POST',
                        endpoint: '/api/v1/zonas',
                        payload,
                        request: () => ApiClient.post('/v1/zonas', payload),
                      })
                    }}
                  >
                    {loading['zonas-create'] ? 'Guardando...' : 'Crear zona'}
                  </button>
                </div>
              </div>
              {renderResult('zonas-all')}
              {renderResult('zonas-create')}
            </div>

            <div className="container">
              <h2>Servicio de Asignaciones de Turnos</h2>
              <div className="example-form">
                <div className="form-row">
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'asignaciones-all',
                        label: 'Obtener todas las asignaciones',
                        method: 'GET',
                        endpoint: '/api/v1/asignaciones-turnos',
                        request: () => ApiClient.get('/v1/asignaciones-turnos'),
                      })
                    }
                  >
                    {loading['asignaciones-all'] ? 'Cargando...' : 'Obtener todas'}
                  </button>
                </div>

                <div className="form-row">
                  <input
                    type="number"
                    value={asignacionForm.docenteId}
                    onChange={(e) => setAsignacionForm({ ...asignacionForm, docenteId: e.target.value })}
                    placeholder="ID docente"
                  />
                  <button
                    onClick={() =>
                      runRequest({
                        key: 'asignaciones-docente',
                        label: 'Obtener asignaciones por docente',
                        method: 'GET',
                        endpoint: `/api/v1/asignaciones-turnos/docente/${asignacionForm.docenteId}`,
                        request: () => ApiClient.get(`/v1/asignaciones-turnos/docente/${asignacionForm.docenteId}`),
                      })
                    }
                  >
                    {loading['asignaciones-docente'] ? 'Cargando...' : 'Obtener por docente'}
                  </button>
                </div>
              </div>
              {renderResult('asignaciones-all')}
              {renderResult('asignaciones-docente')}
            </div>

            <div className="container">
              <h2>Codigo de ejemplo</h2>
              <div className="result success" style={{ display: 'block' }}>
                {codeExample}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  )
}

export default EjemploAPI
