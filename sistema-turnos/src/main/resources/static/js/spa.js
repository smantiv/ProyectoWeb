// Registrar todas las rutas
window.router.register('/', LoginView);
window.router.register('/dashboard-profesor', DashboardProfesorView);
window.router.register('/dashboard-coordinador', DashboardCoordinadorView);
window.router.register('/dashboard-admin', DashboardAdminView);
window.router.register('/mis-turnos', MisTurnosView);
window.router.register('/registrar-punto', RegistrarPuntoView);
window.router.register('/reportar-incidente', ReportarIncidenteView);
window.router.register('/soporte', SoporteView);
window.router.register('/contacto', ContactoView);

console.log('🚀 SPA inicializada correctamente');
