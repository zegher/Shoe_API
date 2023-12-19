<!-- src/App.vue -->
<template>
  <div id="app">
    <div class="container">
      <MyThreeJSComponent />
      <div class="right-side">
        <div class="black-div">
          <h2>Laces Color</h2>
          <div class="buttons-container">
            <button @click="handleButtonClick('white')" class="color-button" :style="{ backgroundColor: 'white', borderColor: '#64f243' }">White</button>
            <button @click="handleButtonClick('grey')" class="color-button" :style="{ backgroundColor: 'grey', borderColor: '#64f243' }">Grey</button>
            <button @click="handleButtonClick('black')" class="color-button" :style="{ backgroundColor: 'black', borderColor: '#64f243' }">Black</button>
            <button @click="handleButtonClick('red')" class="color-button" :style="{ backgroundColor: 'red', borderColor: '#64f243' }">Red</button>
            <button @click="handleButtonClick('blue')" class="color-button" :style="{ backgroundColor: 'blue', borderColor: '#64f243' }">Blue</button>
            <button @click="handleButtonClick('green')" class="color-button" :style="{ backgroundColor: 'green', borderColor: '#64f243' }">Green</button>
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
      shoeModel: null,
      ellipseColors: [/* Add your colors here */],
    };
  },
  methods: {
    handleButtonClick(color) {
      if (this.shoeModel) {
        this.shoeModel.traverse((child) => {
          if (child.isMesh && child.name === 'laces') {
            child.material.color.set(color);
          }
        });
      }
    },
  },
};
</script>

<!-- Add these styles to your App.vue file -->
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

  .color-button {
    width: 60px; /* Adjust width as needed */
    height: 60px; /* Adjust height as needed */
    border-radius: 50%;
    border: 2px solid #ffffff; /* Set border color to white */
    margin-right: 5px; /* Adjust margin as needed */
    cursor: pointer;
    color: #ffffff; /* Set button text color */
  }

  .buttons-container {
    display: flex;
    gap: 5px;
  }
</style>
