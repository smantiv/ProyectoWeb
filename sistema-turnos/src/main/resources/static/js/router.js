const { createRouter, createWebHistory } = VueRouter;

const routes = [
  {
    path: '/',
    component: () => Promise.resolve({
      template: `
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
              <form @submit.prevent="handleLogin" class="form-stack">
                <div class="field">
                  <label for="email">Email o Usuario</label>
                  <input v-model="loginForm.email" id="email" type="text" placeholder="tu.email@sfr.edu" required>
                </div>
                <div class="field">
                  <label for="password">Contraseña</label>
                  <input v-model="loginForm.password" id="password" type="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary btn-full">Ingresar</button>
                <div class="center-link">
                  <a href="#" @click.prevent="$router.push('/reset-password')">¿Olvidaste tu contraseña?</a>
                </div>
              </form>
            </section>

            <section class="quick-access">
              <p class="quick-access-title">Acceso Rápido - Explorar como:</p>
              <div class="role-grid">
                <router-link to="/dashboard-profesor" class="role-card role-profesor">
                  <div class="role-icon-circle">👤</div>
                  <span>Profesor</span>
                </router-link>
                <router-link to="/dashboard-coordinador" class="role-card role-coordinador">
                  <div class="role-icon-circle">🛡️</div>
                  <span>Coordinador</span>
                </router-link>
                <router-link to="/dashboard-admin" class="role-card role-admin">
                  <div class="role-icon-circle">⚙️</div>
                  <span>Administrador</span>
                </router-link>
              </div>
            </section>
          </main>

          <footer class="footer">
            <p>
              <span class="footer-school">Colegio Santa Francisca Romana</span> &copy; 2026
            </p>
            <div class="footer-links">
              <router-link to="/soporte">Soporte</router-link>
              <span>|</span>
              <router-link to="/contacto">Contacto</router-link>
            </div>
          </footer>
        </div>
      `,
      data() {
        return {
          loginForm: {
            email: '',
            password: ''
          }
        }
      },
      methods: {
        handleLogin() {
          axios.post('/api/auth/login', this.loginForm)
            .then(response => {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('user', JSON.stringify(response.data.user));
              this.$router.push('/dashboard-profesor');
            })
            .catch(error => alert('Error: ' + error.response.data.message));
        }
      }
    })
  },

  {
    path: '/dashboard-profesor',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Dashboard Profesor</h1>
            <section class="dashboard-grid">
              <div class="dashboard-card">
                <h2>Mis Turnos</h2>
                <p>Consulta y gestiona tus turnos asignados.</p>
                <router-link to="/mis-turnos" class="btn btn-primary">Ver Turnos</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Registrar Punto</h2>
                <p>Registra tu asistencia a los turnos.</p>
                <router-link to="/registrar-punto" class="btn btn-primary">Registrar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Reportar Incidente</h2>
                <p>Reporta cualquier incidente ocurrido.</p>
                <router-link to="/reportar-incidente" class="btn btn-primary">Reportar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Solicitar Reemplazo</h2>
                <p>Solicita un reemplazo para tu turno.</p>
                <router-link to="/solicitar-reemplazo" class="btn btn-primary">Solicitar</router-link>
              </div>
            </section>
          </main>
        </div>
      `
    })
  },

  {
    path: '/dashboard-coordinador',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Panel de Coordinador</h1>
            <section class="dashboard-grid">
              <div class="dashboard-card">
                <h2>Cobertura en Tiempo Real</h2>
                <router-link to="/cobertura" class="btn btn-primary">Ver Estado</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Gestión de Incidentes</h2>
                <router-link to="/gestion-incidentes" class="btn btn-primary">Gestionar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Reasignar Turnos</h2>
                <router-link to="/reasignar-turnos" class="btn btn-primary">Reasignar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Analíticas</h2>
                <router-link to="/analiticas" class="btn btn-primary">Ver Analíticas</router-link>
              </div>
            </section>
          </main>
        </div>
      `
    })
  },

  {
    path: '/dashboard-admin',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Panel de Administrador</h1>
            <section class="dashboard-grid">
              <div class="dashboard-card">
                <h2>Gestión de Profesores</h2>
                <router-link to="/profesores" class="btn btn-primary">Gestionar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Gestión de Zonas</h2>
                <router-link to="/zonas" class="btn btn-primary">Gestionar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Gestión de Turnos</h2>
                <router-link to="/turnos" class="btn btn-primary">Gestionar</router-link>
              </div>
              <div class="dashboard-card">
                <h2>Reglas Operativas</h2>
                <router-link to="/reglas-operativas" class="btn btn-primary">Configurar</router-link>
              </div>
            </section>
          </main>
        </div>
      `
    })
  },

  {
    path: '/mis-turnos',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Mis Turnos</h1>
            <div class="filters">
              <input v-model="searchText" type="search" placeholder="Buscar turno...">
              <select v-model="filterStatus">
                <option>Todos</option>
                <option>Próximos</option>
                <option>Completados</option>
              </select>
            </div>
            <table class="data-table" v-if="turnos.length">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Zona</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="turno in filteredTurnos" :key="turno.id">
                  <td>{{ turno.fecha }}</td>
                  <td>{{ turno.horaInicio }} - {{ turno.horaFin }}</td>
                  <td>{{ turno.zona }}</td>
                  <td><span class="badge">{{ turno.estado }}</span></td>
                  <td><router-link :to="'/turno/' + turno.id" class="btn-small">Ver</router-link></td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty-state">No hay turnos disponibles</div>
          </main>
        </div>
      `,
      data() {
        return {
          turnos: [],
          searchText: '',
          filterStatus: 'Todos'
        }
      },
      computed: {
        filteredTurnos() {
          return this.turnos.filter(t => 
            t.zona.includes(this.searchText) &&
            (this.filterStatus === 'Todos' || t.estado === this.filterStatus)
          );
        }
      },
      mounted() {
        axios.get('/api/turnos')
          .then(response => this.turnos = response.data)
          .catch(error => console.error(error));
      }
    })
  },

  {
    path: '/soporte',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Centro de Soporte</h1>
            <section class="faq-list">
              <div class="faq-item" v-for="faq in faqs" :key="faq.id">
                <button @click="faq.open = !faq.open" class="faq-question">
                  <div class="faq-question-left">
                    <span class="faq-icon">❓</span>
                    <h3>{{ faq.pregunta }}</h3>
                  </div>
                  <span class="faq-toggle">{{ faq.open ? '▼' : '▶' }}</span>
                </button>
                <div v-if="faq.open" class="faq-answer">
                  <p>{{ faq.respuesta }}</p>
                </div>
              </div>
            </section>
          </main>
        </div>
      `,
      data() {
        return {
          faqs: [
            { id: 1, pregunta: '¿Cómo registro mi asistencia?', respuesta: 'Accede a "Registrar Punto" desde tu dashboard...', open: false },
            { id: 2, pregunta: '¿Cómo solicito un reemplazo?', respuesta: 'Dirígete a "Solicitar Reemplazo"...', open: false },
            { id: 3, pregunta: '¿Cómo reporto un incidente?', respuesta: 'Usa la opción "Reportar Incidente"...', open: false }
          ]
        }
      }
    })
  },

  {
    path: '/contacto',
    component: () => Promise.resolve({
      template: `
        <div class="container">
          <nav-bar></nav-bar>
          <main class="main-content">
            <h1>Contacto</h1>
            <form @submit.prevent="handleContact" class="form-container">
              <div class="form-group">
                <label>Asunto</label>
                <input v-model="form.asunto" type="text" required>
              </div>
              <div class="form-group">
                <label>Mensaje</label>
                <textarea v-model="form.mensaje" rows="6" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Enviar</button>
            </form>
          </main>
        </div>
      `,
      data() {
        return {
          form: { asunto: '', mensaje: '' }
        }
      },
      methods: {
        handleContact() {
          axios.post('/api/contacto', this.form)
            .then(() => {
              alert('Mensaje enviado exitosamente');
              this.form = { asunto: '', mensaje: '' };
            })
            .catch(error => alert('Error: ' + error.message));
        }
      }
    })
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const publicRoutes = ['/'];
  const requiresAuth = !publicRoutes.includes(to.path);
  
  if (requiresAuth && !localStorage.getItem('token')) {
    next('/');
  } else {
    next();
  }
});
