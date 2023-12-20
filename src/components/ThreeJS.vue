<!-- src/components/ThreeJS.vue -->
<template>
  <div class="container">
    <div class="left-side" ref="container"></div>
    <div class="right-side">
      <h1>Pick a color</h1>
      <div class="color-container">
        <div class="color" v-for="color in shoeColors" :style="{ backgroundColor: color }" @click="changeColor(color)"></div>
      </div>
      <button class="confirm-button" @click="confirmChoice">Confirm Choice</button>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  data() {
    return {
      shoeColors: [
        "#000000",
        "#ffffff",
        "#ff0000",
        "#00ff00",
        "#0000ff",
      ],
      shoeParams: {
        inside: { color: "#000000" },
        laces: { color: "#000000" },
        outside_1: { color: "#000000" },
        outside_2: { color: "#000000" },
        sole_1: { color: "#000000" },
        sole_2: { color: "#000000" },
      },
    }
  },
  mounted() {
    const canvasContainer = this.$refs.container;
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    const ratio = windowWidth / windowHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader().setPath("/cubemap/").load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ]);

    const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    resize();
    window.addEventListener("resize", resize);
    function resize() {
      renderer.setSize(window.innerWidth / 1.5, window.innerHeight);
      camera.aspect =
        canvasContainer.clientWidth / canvasContainer.clientHeight;
      camera.updateProjectionMatrix();

      if (window.innerWidth < 500) {
        renderer.setSize(window.innerWidth / 2, window.innerHeight);
        camera.aspect =
          canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
      }
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Disable panning downwards
    controls.maxPolarAngle = Math.PI / 2; // Restrict panning above the horizon
    controls.minDistance = 2; // Set your preferred minimum distance
    controls.maxDistance = 10; // Set your preferred maximum distance


    camera.position.z = 5;

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(0, 1, 1).normalize();
    const light2 = new THREE.DirectionalLight(0xffffff, 3);
    light2.position.set(0, 1, -1).normalize();
    scene.add(light);
    scene.add(light2);

    const loader = new GLTFLoader();

    let shoeModel;

    loader.load('models/shoe-optimized-arne.glb', (gltf) => {
      shoeModel = gltf.scene;

      shoeModel.position.set(0, 1, 0);

      shoeModel.rotation.x = Math.PI / 4;
      shoeModel.rotation.y = Math.PI / 50;

      shoeModel.traverse((o) => {
        if (o.isMesh) {
          console.log(o.name);
        }
      });

      scene.add(shoeModel);

      console.log(this.shoeParams);

      const gui = new dat.GUI();
    for (const partName in this.shoeParams) {
      const folder = gui.addFolder(partName);
      folder.addColor(this.shoeParams[partName], 'color').onChange(function (value) {
        updatePartColor(partName, value);
      });
      folder.open();
      }

      // Set up plane material
     const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });

      // Set up plane with rounded corners
      const roundedRectShape = new THREE.Shape();
      const radius = 0.5; // Adjust the radius for the rounded corners
      roundedRectShape.moveTo(-2.5 + radius, -2.5);
      roundedRectShape.lineTo(2.5 - radius, -2.5);
      roundedRectShape.quadraticCurveTo(2.5, -2.5, 2.5, -2.5 + radius);
      roundedRectShape.lineTo(2.5, 2.5 - radius);
      roundedRectShape.quadraticCurveTo(2.5, 2.5, 2.5 - radius, 2.5);
      roundedRectShape.lineTo(-2.5 + radius, 2.5);
      roundedRectShape.quadraticCurveTo(-2.5, 2.5, -2.5, 2.5 - radius);
      roundedRectShape.lineTo(-2.5, -2.5 + radius);
      roundedRectShape.quadraticCurveTo(-2.5, -2.5, -2.5 + radius, -2.5);

      const roundedRectGeometry = new THREE.ShapeGeometry(roundedRectShape);
      const plane = new THREE.Mesh(roundedRectGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = -1;
      scene.add(plane);

     // Set up plane with mirror-like material
        const mirrorMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,  // Set color to white for reflections
            roughness: 0.1,   // Adjust the roughness
            metalness: 0.9,   // Adjust the metalness
            envMap: scene.background,  // Use the scene background as the environment map for reflections
            side: THREE.DoubleSide,
        });

        const mirrorPlane = new THREE.Mesh(roundedRectGeometry, mirrorMaterial);
        mirrorPlane.rotation.x = Math.PI / 2;
        mirrorPlane.position.y = -1;
        scene.add(mirrorPlane);
    });

    function updatePartColor(partName, color) {
      shoeModel.traverse((o) => {
        if (o.isMesh && o.name === partName) {
          o.material.color = new THREE.Color(color);
        }
      });
    }

        // Add point lights
    const pointLight1 = new THREE.PointLight(0xffffff, 1); // groen - linkse lamp als je inspawnt
    pointLight1.position.set(-2.5, 2, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1); //blauw  - rechtse lamp als je inspawnt
    pointLight2.position.set(2.5, 2, 0);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1); // rood  - voorste lamp als je inspawnt
    pointLight3.position.set(0, 2, 3);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff, 1); // geel - verste lamp als je inspawnt
    pointLight4.position.set(0, 2, -3);
    scene.add(pointLight4);


    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  },
  methods: {
    confirmChoice() {
      // Log or process the color values from Dat.GUI
      console.log('Confirmed Choices:', this.shoeParams);

      // Save the color values to your Vue.js data object
      for (const partName in this.shoeParams) {
        const datGuiColor = this.shoeParams[partName].color;
        // Additional logic to update Three.js model with the new color if needed
      }
    },
  },
}
</script>

<style scoped>
.container {
  display: flex;
}

body {
  background-color: #1a1a1a;
}

.left-side {
  flex: 1;
}

.right-side {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}

.color {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 10px;
  cursor: pointer;
}

.confirm-button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #000000;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin-top: 20px;
}

.confirm-button:hover {
  border-color: #00ff2a;
}
</style>