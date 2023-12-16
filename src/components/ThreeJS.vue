<!-- src/components/ThreeJS.vue -->
<template>
  <div class="left-side" ref="container"></div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  mounted() {
    // Your Three.js code goes here
    const scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader().setPath("/cubemap/").load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ]);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const container = this.$refs.container;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Load in model from /models
    const loader = new GLTFLoader();
    let shoeModel; // Variable to store the loaded model

    // Object to store material parameters for each part
    const materialParameters = {
        laces: {
            color: 0xff0000,
            normalMap: '/textures/Paper_Embossed_001_normal.jpg',
            aoMap: new THREE.TextureLoader().load('./models/textures/Paper_Embossed_001_ambientOcclusion.jpg'),
            displacementMap: new THREE.TextureLoader().load('./models/textures/Paper_Embossed_001_height.png'),
        },
        sole_1: {
            color: 0x00ff00,
        },
        sole_2: {
            color: 0x0000ff,
            normalMap: '/textures/Fabric_Silk_001_normal.jpg',
            aoMap: new THREE.TextureLoader().load('./models/textures/Fabric_Silk_001_ambientOcclusion.jpg'),
            displacementMap: new THREE.TextureLoader().load('./models/textures/Fabric_Silk_001_height.png'),
        },
        inside: {
            color: 0xff0000,
            normalMap: '/textures/Fabric_034_normal.jpg',
            aoMap: new THREE.TextureLoader().load('./models/textures/Fabric_034_ambientOcclusion.jpg'),
            displacementMap: new THREE.TextureLoader().load('./models/textures/Fabric_034_height.png'),
        },
        outside_1: {
            color: 0xff00ff,
        },
        outside_2: {
            color: 0x00ffff,
        },
    };

   // Object to store material information for each part
   const materialInfo = {};

    function createMaterial(params) {
        const { normalMap, map, aoMap, displacementMap, roughnessMap, color, ...otherParams } = params;
        const material = new THREE.MeshStandardMaterial(otherParams);

        if (normalMap) {
            material.normalMap = new THREE.TextureLoader().load(normalMap);
            material.normalMap.wrapS = THREE.RepeatWrapping;
            material.normalMap.wrapT = THREE.RepeatWrapping;
        }

        if (aoMap) {
            material.aoMap = aoMap;
        }

        if (displacementMap) {
            material.displacementMap = displacementMap;
            material.displacementMap.wrapS = THREE.RepeatWrapping;
            material.displacementMap.wrapT = THREE.RepeatWrapping;
            material.displacementScale = 0.1;
        }

        if (map) {
            material.map = new THREE.TextureLoader().load(map);
        }

        if (roughnessMap) {
            material.roughnessMap = new THREE.TextureLoader().load(roughnessMap);
        }

        if (color) {
            const adjustedColor = new THREE.Color(color);
            adjustedColor.multiplyScalar(0.5);
            material.color = adjustedColor;

            // Store material information
            materialInfo[params.name] = {
                color: adjustedColor.getHex(),
                // Add other material properties you want to store
            };
        }

        return material;
    }

    // Load the model
    loader.load('models/shoe-optimized-arne.glb', function (gltf) {
        shoeModel = gltf.scene;

        // Set the position of the shoeModel
        shoeModel.position.set(0, 1, 0);

        // Tilt the shoe forward (nose down) by adjusting the rotation
        shoeModel.rotation.x = Math.PI / 4; // Adjust the angle as needed
        shoeModel.rotation.y = Math.PI / 50;

        // Traverse through the model and assign materials to specific parts
        shoeModel.traverse((child) => {
            if (child.isMesh) {
                const partName = child.name;
                const partMaterial = materialParameters[partName];

                if (partMaterial) {
                    // Create a new material
                    child.material = createMaterial({ ...partMaterial, name: partName });
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

    // Event listener for window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
    })

    // Set up plane material
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set up raycaster and mouse vector
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Event listener for mouse clicks
    document.addEventListener('click', onDocumentClick);

    function onDocumentClick(event) {
        // Calculate mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Set the raycaster's ray direction and origin based on the mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections with the shoeModel
        const intersects = raycaster.intersectObject(shoeModel, true);

        if (intersects.length > 0) {
            // Get the clicked part
            const clickedPart = intersects[0].object;

            // Log the name of the clicked part to the console
            console.log('Clicked part:', clickedPart.name);
        }
    }

    /*
    // Example usage of the stored material information
    function saveMaterialInfoToAPI() {
        fetch('your/api/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(materialInfo),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Material information saved:', data);
        })
        .catch(error => {
            console.error('Error saving material information:', error);
        });
    }
    */

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
        metalness: 0.5,   // Adjust the metalness
        envMap: scene.background,  // Use the scene background as the environment map for reflections
        side: THREE.DoubleSide,
    });

    const mirrorPlane = new THREE.Mesh(roundedRectGeometry, mirrorMaterial);
    mirrorPlane.rotation.x = Math.PI / 2;
    mirrorPlane.position.y = -1;
    scene.add(mirrorPlane);


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

    /*
    // add orange pointlight 5
    const pointLight5 = new THREE.PointLight(0xffffff, 1); // oranje -- onderste licht
    pointLight5.position.set(0, -0.8, 0);
    scene.add(pointLight5);
    */


    /*

    // add pointlight helper
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
    // add pointlight 5 helper
    const pointLightHelper5 = new THREE.PointLightHelper(pointLight5, 1);
    scene.add(pointLightHelper5);
    */

    // Add shadows
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Set up animation function
      function animate() {
          requestAnimationFrame(animate);

          // Rotate the loaded model
          if (shoeModel) {
            // shoeModel.rotation.y += 0.001;
          }

          // Update controls
          controls.update();

          // Render the scene
          renderer.render(scene, camera);
        }

        // Start animation
        animate();
  },
};
</script>

<style scoped>
/* Add styles if needed */
.left-side {
  flex: 1;
}
</style>