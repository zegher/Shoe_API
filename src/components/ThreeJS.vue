<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Updated import statement

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

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

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
const plane = new THREE.Mesh(roundedRectGeometry, material);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Set up plane with mirror-like material
const mirrorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,  // Set color to white for reflections
    roughness: 0.1,   // Adjust the roughness
    metalness: 0.5,   // Adjust the metalness
    envMap: scene.background,  // Use the scene background as the environment map for reflections
    side: THREE.DoubleSide,
});

const mirrorPlane = new THREE.Mesh(roundedRectGeometry, mirrorMaterial);
mirrorPlane.rotation.x = Math.PI / 2;
mirrorPlane.position.y = -1;
scene.add(mirrorPlane);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement); // Use OrbitControls directly

// Set camera position
camera.position.z = 5;

// Set up raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse clicks
document.addEventListener('click', onDocumentClick);

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

// Add orange pointlight 5
/*
const pointLight5 = new THREE.PointLight(0xffffff, 1); // oranje -- onderste licht
pointLight5.position.set(0, -0.8, 0);
scene.add(pointLight5);
*/

/*
// Add pointlight helpers
const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1);
scene.add(pointLightHelper1);

const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1);
scene.add(pointLightHelper2);

const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1);
scene.add(pointLightHelper3);

const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, 1);
scene.add(pointLightHelper4);
*/

/*
// Add pointlight 5 helper
const pointLightHelper5 = new THREE.PointLightHelper(pointLight5, 1);
scene.add(pointLightHelper5);
*/

function onDocumentClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Set the raycaster's ray direction and origin based on the mouse position
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with the cube
    const intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        // Log the name of the clicked part to the console
        console.log('Clicked on cube!');
    }
}

// Set up animation function
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Update controls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

// Start animation
animate();
</script>

<template>
    <!-- If you have any Vue template content, you can add it here -->
</template>

<style scoped>
    /* If you have any scoped styles, you can add them here */
</style>
