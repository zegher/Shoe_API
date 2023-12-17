<!-- src/App.vue -->

<template>
  <div id="app">
    <div class="container">
      <MyThreeJSComponent />
      <div class="right-side">
        <div class="black-div">
          <h2>Laces Color</h2>
          <!-- Button and ellipses added here -->
          <div class="ellipses-container">
            <div v-for="(color, index) in ellipseColors" :key="index" class="ellipse" :style="{ backgroundColor: color, borderColor: strokeColor }"></div>
          </div>
          <div class="bottom-right">
            <router-link to="/threejs-screen" v-slot="{ navigate }">
              <button @click="navigate">Click me</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyThreeJSComponent from './components/ThreeJS.vue';

export default {
  components: {
    MyThreeJSComponent,
  },
  data() {
    return {
      ellipseColors: ['#FFFFFF', '#484848', '#060606', '#FF0000', '#0000FF', '#1BBF00'],
      strokeColor: '#64F243',
    };
  },
};
</script>

<style>
/* Add styles if needed */

.container {
  display: flex;
  height: 100vh;
}

.right-side {
  flex: 1;
  background-color: #141414;
  color: #ffffff; /* Set text color */
  padding: 20px; /* Adjust padding as needed */
}

.right-side h2 {
  color: #ffffff; /* Set header text color */
}

.bottom-right {
  position: absolute;
  bottom: 10px;
  right: 10px;
  text-align: right;
}

.ellipses-container {
  display: flex;
  gap: 5px;
}

.ellipse {
  width: 60px; /* Adjust width as needed */
  height: 60px; /* Adjust height as needed */
  border-radius: 50%;
  border: 2px solid;
}
</style>
