// Vista de Login
const LoginView = {
  render() {
    return `
      <div class="page page-login">
        <nav class="topbar">
          <div class="brand">
            <img src="/assets/logo-sfr.png" alt="Logo" class="brand-logo small-round">
            <span class="brand-title">Sistema de Vigilancia Escolar</span>
          </div>
        </nav>

        <main class="main-center">
          <section class="login-header">
            <div class="hero-logo-wrap">
              <img src="/assets/logo-sfr.png" alt="Logo" class="hero-logo">
            </div>
            <h1>Bienvenido al Sistema de Vigilancia</h1>
            <p>Accede con tu cuenta institucional para gestionar los turnos de vigilancia escolar.</p>
          </section>

          <section class="card login-card">
            <h2>Iniciar Sesión</h2>
            <form id="loginForm" class="form-stack">
              <div class="field">
                <label for="email">Email o Usuario</label>
                <input id="email" type="text" placeholder="tu.email@sfr.edu">
              </div>

              <div class="field">
                <label for="password">Contraseña</label>
                <input id="password" type="password" placeholder="••••••••">
              </div>

              <button type="submit" class="btn btn-primary btn-full">
                Ingresar
              </button>

              <div class="center-link">
                <a href="#" id="forgotPasswordLink">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </section>

          <section class="quick-access">
            <p class="quick-access-title">Acceso Rápido - Explorar como:</p>
            <div class="role-grid">
              <a href="/dashboard-profesor" data-link class="role-card role-profesor">
                <div class="role-icon-circle">👤</div>
                <span>Profesor</span>
              </a>
              <a href="/dashboard-coordinador" data-link class="role-card role-coordinador">
                <div class="role-icon-circle">🛡️</div>
                <span>Coordinador</span>
              </a>
              <a href="/dashboard-admin" data-link class="role-card role-admin">
                <div class="role-icon-circle">⚙️</div>
                <span>Administrador</span>
              </a>
            </div>
          </section>
        </main>

        <footer class="footer">
          <p><span class="footer-school">Colegio Santa Francisca Romana</span> &copy; 2026</p>
          <div class="footer-links">
            <a href="/soporte" data-link>Soporte</a>
            <span>|</span>
            <a href="/contacto" data-link>Contacto</a>
          </div>
        </footer>
      </div>
    `;
  },
  afterRender() {
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      // Lógica de login
      window.router.navigate('/dashboard-profesor');
    });
  }
};

// Vista Dashboard Profesor
const DashboardProfesorView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <div class="brand">
            <span class="brand-title">Dashboard Profesor</span>
          </div>
          <div class="topbar-actions">
            <a href="/" data-link>Inicio</a>
            <a href="/mi-perfil" data-link>Perfil</a>
          </div>
        </nav>

        <main class="container">
          <h1>Dashboard Profesor</h1>
          <section class="dashboard-grid">
            <div class="dashboard-card">
              <h2>Mis Turnos</h2>
              <p>Consulta y gestiona tus turnos asignados.</p>
              <a href="/mis-turnos" data-link class="btn btn-primary">Ver Turnos</a>
            </div>
            <div class="dashboard-card">
              <h2>Registrar Punto</h2>
              <p>Registra tu asistencia a los turnos.</p>
              <a href="/registrar-punto" data-link class="btn btn-primary">Registrar</a>
            </div>
            <div class="dashboard-card">
              <h2>Reportar Incidente</h2>
              <p>Reporta cualquier incidente ocurrido durante la vigilancia.</p>
              <a href="/reportar-incidente" data-link class="btn btn-primary">Reportar</a>
            </div>
          </section>
        </main>
      </div>
    `;
  }
};

// Vista Dashboard Coordinador
const DashboardCoordinadorView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <div class="brand">
            <span class="brand-title">Dashboard Coordinador</span>
          </div>
          <div class="topbar-actions">
            <a href="/" data-link>Inicio</a>
            <a href="/mi-perfil" data-link>Perfil</a>
          </div>
        </nav>

        <main class="container">
          <h1>Dashboard Coordinador</h1>
          <section class="dashboard-grid">
            <div class="dashboard-card">
              <h2>Cobertura en Tiempo Real</h2>
              <p>Visualiza el estado actual de vigilancia.</p>
              <a href="/cobertura" data-link class="btn btn-primary">Ver Estado</a>
            </div>
            <div class="dashboard-card">
              <h2>Gestión de Incidentes</h2>
              <p>Administra y revisa los incidentes reportados.</p>
              <a href="/gestion-incidentes" data-link class="btn btn-primary">Gestionar</a>
            </div>
            <div class="dashboard-card">
              <h2>Analíticas</h2>
              <p>Consulta estadísticas y reportes.</p>
              <a href="/analiticas" data-link class="btn btn-primary">Ver Analíticas</a>
            </div>
          </section>
        </main>
      </div>
    `;
  }
};

// Vista Dashboard Admin
const DashboardAdminView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <div class="brand">
            <span class="brand-title">Dashboard Administrador</span>
          </div>
          <div class="topbar-actions">
            <a href="/" data-link>Inicio</a>
            <a href="/mi-perfil" data-link>Perfil</a>
          </div>
        </nav>

        <main class="container">
          <h1>Panel de Administrador</h1>
          <section class="dashboard-grid">
            <div class="dashboard-card">
              <h2>Gestión de Profesores</h2>
              <p>Administra el personal docente del sistema.</p>
              <a href="/profesores" data-link class="btn btn-primary">Gestionar</a>
            </div>
            <div class="dashboard-card">
              <h2>Gestión de Zonas</h2>
              <p>Configura las zonas de vigilancia.</p>
              <a href="/zonas" data-link class="btn btn-primary">Gestionar</a>
            </div>
            <div class="dashboard-card">
              <h2>Gestión de Turnos</h2>
              <p>Crea y asigna turnos de vigilancia.</p>
              <a href="/turnos" data-link class="btn btn-primary">Gestionar</a>
            </div>
          </section>
        </main>
      </div>
    `;
  }
};

// Vistas adicionales placeholder
const MisTurnosView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <a href="/dashboard-profesor" data-link class="back-btn">← Volver</a>
          <span class="brand-title">Mis Turnos</span>
        </nav>
        <main class="container">
          <h1>Mis Turnos</h1>
          <p>Contenido de mis turnos...</p>
        </main>
      </div>
    `;
  }
};

const RegistrarPuntoView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <a href="/dashboard-profesor" data-link class="back-btn">← Volver</a>
          <span class="brand-title">Registrar Punto</span>
        </nav>
        <main class="container">
          <h1>Registrar Punto de Asistencia</h1>
          <p>Contenido para registrar punto...</p>
        </main>
      </div>
    `;
  }
};

const ReportarIncidenteView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <a href="/dashboard-profesor" data-link class="back-btn">← Volver</a>
          <span class="brand-title">Reportar Incidente</span>
        </nav>
        <main class="container">
          <h1>Reportar Incidente</h1>
          <p>Contenido para reportar incidente...</p>
        </main>
      </div>
    `;
  }
};

const SoporteView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <a href="/" data-link class="back-btn">← Volver</a>
          <span class="brand-title">Soporte</span>
        </nav>
        <main class="container">
          <h1>Centro de Soporte</h1>
          <p>Contenido de soporte...</p>
        </main>
      </div>
    `;
  }
};

const ContactoView = {
  render() {
    return `
      <div class="page">
        <nav class="topbar">
          <a href="/" data-link class="back-btn">← Volver</a>
          <span class="brand-title">Contacto</span>
        </nav>
        <main class="container">
          <h1>Contacto</h1>
          <p>Contenido de contacto...</p>
        </main>
      </div>
    `;
  }
};
