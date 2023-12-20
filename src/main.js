// main.js
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ThreeJS from './components/ThreeJS.vue';
import ShoeSummary from './components/ShoeSummary.vue';

const routes = [
  { path: '/', component: ThreeJS, name: 'threejs' },
  { path: '/summary', component: ShoeSummary, name: 'summary' }, // Add the summary route
  // Add other routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
