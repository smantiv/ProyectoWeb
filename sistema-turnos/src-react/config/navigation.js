export const ROLE_HOME = {
  admin: '/dashboard-admin',
  coordinador: '/dashboard-coordinador',
  profesor: '/dashboard-profesor',
}

export const NAV_ITEMS = {
  admin: [
    { label: 'Inicio', to: '/dashboard-admin' },
    { label: 'Profesores', to: '/gestion-profesores' },
    { label: 'Turnos', to: '/gestion-turnos' },
    { label: 'Zonas', to: '/gestion-zonas' },
    { label: 'Reglas', to: '/reglas-operativas' },
    { label: 'Perfil', to: '/perfil-cuenta' },
  ],
  coordinador: [
    { label: 'Inicio', to: '/dashboard-coordinador' },
    { label: 'Tablero', to: '/tablero-coordinacion' },
    { label: 'Cobertura', to: '/cobertura-tiempo-real' },
    { label: 'Incidentes', to: '/gestion-incidentes' },
    { label: 'Analiticas', to: '/analiticas' },
    { label: 'Metricas', to: '/MetricasPositivasDocentes' },
    { label: 'Reconocimientos', to: '/reconocimientos-institucionales' },
    { label: 'Perfil', to: '/perfil-coordinador' },
  ],
  profesor: [
    { label: 'Inicio', to: '/dashboard-profesor' },
    { label: 'Mis turnos', to: '/mis-turnos' },
    { label: 'Registrar punto', to: '/registrar-punto' },
    { label: 'Reportar incidente', to: '/reportar-incidente' },
    { label: 'Solicitar reemplazo', to: '/solicitar-reemplazo' },
    { label: 'Perfil', to: '/perfil-profesor' },
  ],
}

export const COMMON_NAV_ITEMS = [
  { label: 'Soporte', to: '/soporte' },
  { label: 'Contacto', to: '/contacto' },
]
