<!-- src/components/ThreeJS.vue -->
<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import dat from 'dat.gui';

// Define shoeParams and shoeColors
const shoeParams = {
  inside: { color: 0x00ff00 },
  laces: { color: 0xff0000 },
  outside_1: { color: 0x0000ff },
  outside_2: { color: 0xffff00 },
  sole_1: { color: 0x00ffff },
  sole_2: { color: 0xff00ff },
};

const shoeColors = Object.values(shoeParams).map(param => param.color.toString(16));

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader().setPath("/cubemap/").load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png",
]);

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set camera position
camera.position.z = 5;

// Load 3D shoe model
const loader = new GLTFLoader();
let shoeModel;

loader.load('models/shoe-optimized-arne.glb', (gltf) => {
    shoeModel = gltf.scene;

    shoeModel.position.set(0, 2, 0);

    shoeModel.rotation.x = Math.PI / 4;
    shoeModel.rotation.y = Math.PI / 50;

    shoeModel.traverse((o) => {
        if (o.isMesh) {
            console.log(o.name);
        }
    });

    scene.add(shoeModel);

    // Add GUI for color selection
    const gui = new dat.GUI();
    for (const partName in this.shoeParams) {
        const folder = gui.addFolder(partName);
        folder.addColor(this.shoeParams[partName], 'color').onChange(function (value) {
            updatePartColor(partName, value);
        });
        folder.open();
    }
});

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
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Define material for the plane
const plane = new THREE.Mesh(roundedRectGeometry, material);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Set up plane with mirror-like material
const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.5,
    envMap: scene.background,
    side: THREE.DoubleSide,
});

const mirrorPlane = new THREE.Mesh(roundedRectGeometry, mirrorMaterial);
mirrorPlane.rotation.x = Math.PI / 2;
mirrorPlane.position.y = -1;
scene.add(mirrorPlane);

// Set up raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks
document.addEventListener('click', onDocumentClick);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Add point lights
const pointLight1 = new THREE.PointLight(0xffffff, 1);
pointLight1.position.set(-2.5, 2, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 1);
pointLight2.position.set(2.5, 2, 0);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 1);
pointLight3.position.set(0, 2, 3);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 1);
pointLight4.position.set(0, 2, -3);
scene.add(pointLight4);

// Add orange pointlight 5
const pointLight5 = new THREE.PointLight(0xffffff, 1);
pointLight5.position.set(0, -0.8, 0);
scene.add(pointLight5);

function onDocumentClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Set the raycaster's ray direction and origin based on the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the shoe model
    const intersects = raycaster.intersectObject(shoeModel);

    if (intersects.length > 0) {
        console.log('Clicked on the shoe model!');
    }
}

// Helper function to update part color
function updatePartColor(partName, color) {
    shoeModel.traverse((o) => {
        if (o.isMesh && o.name === partName) {
            o.material.color = new THREE.Color(color);
        }
    });
}

// Set up animation function
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Start animation
animate();
</script>

<template>
  <div class="left-side" ref="container"></div>
  <div class="right-side">
      <h1>Pick a color</h1>
      <div class="color-container">
          <div class="color" v-for="color in shoeColors" :style="{ backgroundColor: '#' + color }"></div>
      </div>
  </div>
</template>

<style scoped>
    /* If you have any CSS, you can add it here */
</style>
