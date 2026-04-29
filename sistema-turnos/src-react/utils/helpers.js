// Utilidades comunes para la aplicación React

/**
 * Formatear fecha a string legible
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formatear hora
 * @param {string} time - Hora en formato HH:mm
 * @returns {string} Hora formateada
 */
export const formatTime = (time) => {
  if (!time) return ''
  return time.substring(0, 5) // Retorna solo HH:mm
}

/**
 * Obtener color según estado
 * @param {string} estado - Estado del turno
 * @returns {string} Clase CSS del color
 */
export const getStatusColor = (estado) => {
  const status = estado?.toLowerCase()
  switch (status) {
    case 'completado':
    case 'aceptado':
      return 'green'
    case 'pendiente':
    case 'en_progreso':
      return 'orange'
    case 'cancelado':
    case 'rechazado':
      return 'red'
    default:
      return 'navy'
  }
}

/**
 * Obtener emoji según rol
 * @param {string} rol - Rol del usuario
 * @returns {string} Emoji correspondiente
 */
export const getRoleEmoji = (rol) => {
  const role = rol?.toLowerCase()
  switch (role) {
    case 'profesor':
      return '👨‍🏫'
    case 'coordinador':
      return '👔'
    case 'admin':
    case 'administrador':
      return '⚙️'
    default:
      return '👤'
  }
}

/**
 * Obtener clase avatar según rol
 * @param {string} rol - Rol del usuario
 * @returns {string} Clase CSS
 */
export const getAvatarClass = (rol) => {
  const role = rol?.toLowerCase()
  if (role === 'admin' || role === 'administrador') {
    return 'profile-avatar profile-avatar-admin'
  }
  return 'profile-avatar'
}

/**
 * Truncar texto a N caracteres
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncateText = (text, length = 50) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Validar email
 * @param {string} email - Email a validar
 * @returns {boolean} Es válido
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Obtener diferencia de días entre dos fechas
 * @param {Date|string} date1 - Primera fecha
 * @param {Date|string} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Verificar si una fecha es hoy
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} Es hoy
 */
export const isToday = (date) => {
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Verificar si una fecha es en el futuro
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} Es en el futuro
 */
export const isFuture = (date) => {
  return new Date(date) > new Date()
}

/**
 * Formatear número como moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Código de moneda (ej: 'USD')
 * @returns {string} Cantidad formateada
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Generar color aleatorio
 * @returns {string} Color en formato hex
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * Deep clone de un objeto
 * @param {object} obj - Objeto a clonar
 * @returns {object} Clon del objeto
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const calculatePercentage = (value, total) => {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}
