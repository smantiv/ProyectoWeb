const NavBar = {
  template: `
    <nav class="topbar">
      <div class="brand">
        <img src="/assets/logo-sfr.png" alt="Logo" class="brand-logo small-round">
        <span class="brand-title">Sistema de Vigilancia Escolar</span>
      </div>
      <div class="user-nav">
        <router-link to="/mi-perfil" class="profile-box">
          <div class="profile-avatar">{{ userInitials }}</div>
          <span>{{ userName }}</span>
        </router-link>
        <button @click="logout" class="btn btn-small">Cerrar Sesión</button>
      </div>
    </nav>
  `,
  computed: {
    userName() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.nombre || 'Usuario';
    },
    userInitials() {
      return this.userName.substring(0, 2).toUpperCase();
    }
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push('/');
    }
  }
};
