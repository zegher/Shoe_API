// Import Three.js directly from the CDN
import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

// Load in model from /models
const loader = new GLTFLoader();
let shoeModel; // Variable to store the loaded model
loader.load('./public/models/shoe-optimized-arne.glb', function (gltf) {
    shoeModel = gltf.scene;
    // Set the position of the shoeModel
    shoeModel.position.set(0, 0, 0);
    scene.add(shoeModel);
}, undefined, function (error) {
    console.error(error);
});

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set up plane underneath cube
const planeGeometry = new THREE.PlaneGeometry(5, 5, 32);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Set camera position
camera.position.z = 5;

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff,1);
scene.add(ambientLight);

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

// add pointlight helper
const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1);
scene.add(pointLightHelper1);

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
scene.add(pointLightHelper2);

const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1);
scene.add(pointLightHelper3);

const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, 1);
scene.add(pointLightHelper4);

// Add shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Set up animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the loaded model
    if (shoeModel) {
        shoeModel.rotation.y += 0.001;
    }

    // Update controls
    controls.update();

    renderer.render(scene, camera);
}

// Start animation
animate();
