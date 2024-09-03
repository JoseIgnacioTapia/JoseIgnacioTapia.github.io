import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const container = document.getElementById('animation-container');
const loader = document.getElementById('loader');

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
container.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
const scene = new THREE.Scene();

// Background color scene
const darkBlue = new THREE.Color(0x080f1a);
const lightBlue = new THREE.Color(0x234563); // Un tono ligeramente más claro
scene.background = darkBlue;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
// Desable scroll zoom
controls.enableZoom = false;

// Variables to store the mouse position
let mouseX = 0;
let mouseY = 0;
let mouseMoved = false; // variable para comprobar si el mouse se movió
const maxDistance = Math.sqrt(w * w + h * h) / 2; // Maximum possible distance to the center

// Detecting mouse movement
window.addEventListener('mousemove', event => {
  mouseX = event.clientX - w / 2;
  mouseY = event.clientY - h / 2;
  mouseMoved = true;
});

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);
// Reduce the object scale by 25%
mesh.scale.set(0.8, 0.8, 0.8);
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1);
mesh.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);

function animate(t = 0) {
  requestAnimationFrame(animate);

  // Solo realiza la interpolación si el ratón se ha movido
  if (mouseMoved) {
    // Calculate the distance from the cursor to the center
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    const intensity = 1 - Math.min(distance / maxDistance, 1); // Intensity based on distance

    // Interpolate between the two colors
    scene.background = darkBlue.clone().lerp(lightBlue, intensity * 0.2); // Subtle adjustment
  }

  mesh.rotation.y = t * 0.0001;
  renderer.render(scene, camera);
  controls.update();
}
animate();

// Show the animation container and hide the loader when Three.js is ready
window.addEventListener('load', () => {
  loader.style.display = 'none';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';
});
