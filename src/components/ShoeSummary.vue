  <!-- ShoeSummary.vue -->
  <template>
    <div>
      <h1>Shoe Summary</h1>
      <div class="shoe-container">
        <div v-if="shoeOrder">
          <h2>{{ shoeOrder.brand }} - Size {{ shoeOrder.size }}</h2>
          <three-js-shoe :shoeParams="shoeParams" />
        </div>
        <div v-else>
          <p>No shoe data available.</p>
        </div>
      </div>

      <!-- Input field for shoe size -->
      <label for="shoeSize">Shoe Size:</label>
      <input type="number" id="shoeSize" v-model="shoeSize" />

      <!-- Button to save colors and navigate -->
      <button @click="saveColorsAndNavigate">Go to Fill Info</button>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';

  // Props
  const { shoeOrder, yourReactiveProxy } = defineProps(['shoeOrder', 'yourReactiveProxy']);

  // Reactive variables
  const shoeParams = yourReactiveProxy;
  const shoeSize = ref(null);

  // Methods
  const saveColorsAndNavigate = () => {
    // Log the selected shoe size and colors
    console.log('Shoe Size:', shoeSize.value);
    console.log('Selected Colors:', shoeParams);

    // Perform other actions, such as sending data to the API

    // For navigation, you can use the router instance
    $router.push({ name: 'fill-info', params: { orderId: shoeOrder.id, colors: shoeParams.colors } });
  };
  </script>

  <style scoped>
  /* Your existing custom styling for the summary page */
  .shoe-container {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-top: 10px;
  }
  </style>
