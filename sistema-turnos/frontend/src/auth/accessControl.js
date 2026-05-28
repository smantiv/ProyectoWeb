export const ROLE_HOME = {
  ADMIN: '/dashboard-admin',
  DOCENTE: '/dashboard-profesor',
  COORDINADOR: '/dashboard-coordinador',
};

export const ROLE_LABEL = {
  ADMIN: 'Admin',
  DOCENTE: 'Profesor',
  COORDINADOR: 'Coordinador',
};

export function canAccess(user, roles = []) {
  if (!user) return false;
  if (!roles.length) return true;
  return roles.includes(user.rol);
}

export function homeForRole(role) {
  return ROLE_HOME[role] || '/dashboard-profesor';
}
