<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';

// Use onMounted to perform actions when the component is mounted
onMounted(() => {
  // Access the route and router using the functions from vue-router
  const route = useRoute();
  const router = useRouter();
  console.log('Current route:', route);
  console.log('Router instance:', router);
});

// Import necessary functions from Vue Router
import { useRouter, useRoute } from 'vue-router';
</script>


<style scoped>
#app {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
