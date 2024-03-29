import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

// gltf loader for loading models
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

/**
 * Raycaster
 */

// ##### Instantiate a Raycaster #####
const raycaster = new THREE.Raycaster();

// We can use the set(...) method to set the origin and direction of ray.
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);

// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);

// // ##### Cast a ray #####
// const intersect = raycaster.intersectObject(object2);
// console.log(intersect, "intersect");

// const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects, "intersecst---");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Cursor
 */

// create a cursor variable with Vector2 and update it when the cursor is moving
// to handle 'mouseenter' and 'mouseleave' we create cursor variable
const cursor = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width) * 2 - 1;
  cursor.y = -(event.clientY / sizes.height) * 2 + 1;

  // We should avoid casting the ray in the mousemove event callback and do it in the tick function
});

// mouse click event
window.addEventListener("click", (_event) => {
  if (currentHoverdObject) {
    switch (currentHoverdObject.object) {
      case object1:
        console.log("click on object 1");
        break;
      case object2:
        console.log("click on object 2");
        break;
      case object3:
        console.log("click on object 3");
        break;
    }
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Models
 */
const gltfLoader = new GLTFLoader();
let model = null;

gltfLoader.load("./models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  console.log("loaded");
  model = gltf.scene;
  model.position.y = -1.2;
  scene.add(model);
});

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#ffffff", 0.7);
directionalLight.position.set(1, 2, 3);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock();

// currently hovered object
let currentHoverdObject = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate the sphere by using the elapsed time and Math.sin(...) in the tick function.

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

  // Now update raycaster in the tick  function
  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDirection = new THREE.Vector3(1, 0, 0);
  //   rayDirection.normalize();

  //   raycaster.set(rayOrigin, rayDirection);

  // ##### Cast a ray #####

  // To cast ray from the camera
  raycaster.setFromCamera(cursor, camera);
  const objectsToTest = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToTest);

  //   console.log(intersects.length, "intersects");

  // We have to set the color of object to it's initial on every render.
  for (const object of objectsToTest) {
    object.material.color.set("#ff0000");
  }

  // Now we will update the material of the object property for each item of 'intersects' array
  // This changes the color of object to blue for always and not only when it intersect
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
  }

  // ''mouseenter' and 'mouseleave' event handles here
  if (intersects.length) {
    if (currentHoverdObject === null) {
      console.log("mouse enter");
    }
    currentHoverdObject = intersects[0];
  } else {
    if (currentHoverdObject) {
      console.log("mouse leave");
    }
    currentHoverdObject = null;
  }

  // Create a variable modelIntersects
  if (model) {
    const modelIntersects = raycaster.intersectObject(model);
    // console.log(modelIntersects);

    if (modelIntersects.length > 0) {
      model.scale.set(1.2, 1.2, 1.2);
    } else {
      model.scale.set(1, 1, 1);
    }
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
