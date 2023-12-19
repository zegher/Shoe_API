// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import HomeScreen from '../components/HomeScreen.vue';
import ThreeJsScreen from '../components/ThreeJS.vue';

const routes = [
  {
    path: '/',
    name: 'HomeScreen',
    component: HomeScreen,
  },
  {
    path: '/threejs-screen',
    name: 'ThreeJsScreen',
    component: ThreeJsScreen,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
