// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import ThreeJS from '../components/ThreeJS.vue';
import ShoeSummary from '../components/ShoeSummary.vue';

const routes = [
  {
    path: '/',
    redirect: '/threejs', // Redirect to the ThreeJS component
  },
  {
    path: '/threejs',
    name: 'threejs',
    component: ThreeJS,
  },
  {
    path: '/summary/:orderId?',
    name: 'summary',
    component: ShoeSummary,
    props: true,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/threejs', // Redirect unknown paths to ThreeJS
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
