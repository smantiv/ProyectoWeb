const { createApp } = Vue;

const app = createApp({
  template: '<router-view></router-view>'
});

app.component('nav-bar', NavBar);
app.use(router);
app.mount('#app');
