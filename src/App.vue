<!-- src/App.vue -->

<template>
  <div id="app">
    <div class="container">
      <MyThreeJSComponent />
      <div class="right-side">
        <div class="black-div">
          <h2>Header</h2>
          <p>This is the right side content.</p>
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
  background-color: #666464;
  color: #ffffff; /* Set text color */
  padding: 20px; /* Adjust padding as needed */
}

.right-side h2 {
  color: #ffffff; /* Set header text color */
}
</style>
