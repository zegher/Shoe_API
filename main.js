// Import Three.js directly from the CDN
import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// Import dat.gui 
import dat from 'dat.gui';

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

// Object to store material parameters for each part
const materialParameters = {
    laces: {
        color: 0xff0000,
    },
    sole_1: {
        color: 0x00ff00,
    },
    sole_2: {
        color: 0x0000ff,
    },
    inside: {
        color: 0xff0000,
    },
    outside_1: {
        color: 0xff00ff,
    },
    outside_2: {
        color: 0x00ffff,
    },
};

// Function to create a MeshStandardMaterial with the desired properties
function createMaterial(params) {
    return new THREE.MeshStandardMaterial(params);
}

loader.load('models/shoe-optimized-arne.glb', function (gltf) {
    shoeModel = gltf.scene;

    // Set the position of the shoeModel
    shoeModel.position.set(0, 0, 0);

    // Traverse through the model and assign materials to specific parts
    shoeModel.traverse((child) => {
        if (child.isMesh) {
            const partName = child.name;
            const partMaterial = materialParameters[partName];

            if (partMaterial) {
                // Create a new material
                child.material = createMaterial(partMaterial);
            }
        }
    });

    scene.add(shoeModel);

    // Add dat.gui for color adjustment
    const gui = new dat.GUI();
    for (const partName in materialParameters) {
        const folder = gui.addFolder(partName);
        folder.addColor(materialParameters[partName], 'color').onChange(function (value) {
            updatePartColor(partName, value);
        });
        folder.open();
    }
}, undefined, function (error) {
    console.error(error);
});

// Function to update the color of a specific part
function updatePartColor(partName, color) {
    if (shoeModel) {
        shoeModel.traverse((child) => {
            if (child.isMesh && child.name === partName) {
                child.material.color.set(color);
            }
        });
    }
}

// Function to update the roughness of a specific part
function updatePartRoughness(partName, roughness) {
    if (shoeModel) {
        shoeModel.traverse((child) => {
            if (child.isMesh && child.name === partName) {
                child.material.roughness = roughness;
            }
        });
    }
}

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
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
