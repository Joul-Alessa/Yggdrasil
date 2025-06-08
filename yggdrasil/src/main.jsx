import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Controladores helpers ELIMINAR

// Configuraciones generales de la escena 3D
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(100);
camera.position.setY(60);
camera.position.setZ(120);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshPhongMaterial({ color: 0xFF6347, wireframe: true });
//const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);

// Controladores helpers ELIMINAR
const controls = new OrbitControls(camera, renderer.domElement);
function animate(){
  requestAnimationFrame(animate);
  //torus.rotation.x += 0.01;
  renderer.render(scene, camera);
  controls.update();
};
animate();

// Configuraciones del suelo
const soilGeometry = new THREE.BoxGeometry(1000, 0, 1000); // width, height, depth
const soilMaterial = new THREE.MeshPhongMaterial({ color: 0xB6EEA7 });
const soil = new THREE.Mesh(soilGeometry, soilMaterial);
scene.add(soil);

const soilAuxGeometry = new THREE.BoxGeometry(1000, 0.1, 1000); // width, height, depth
const soilAuxMaterial = new THREE.MeshStandardMaterial({ color: 0xB6EEA7 });
const soilAux = new THREE.Mesh(soilAuxGeometry, soilAuxMaterial);
soilAux.position.set(0,-0.5,0);
scene.add(soilAux);

// Configuraciones del árbol de Yggdrasil
const mainTreeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 80, 30); // radiusTop, radiusBottom, height, radialSegments
const mainTreeTrunkMaterial = new THREE.MeshPhongMaterial({ color: 0xBCAEA1 });
const mainTreeTrunk = new THREE.Mesh(mainTreeTrunkGeometry, mainTreeTrunkMaterial);
mainTreeTrunk.position.set(0,40,0);
scene.add(mainTreeTrunk);

const verticesOfCube = [
	- 1, - 1, - 1, 1, - 1, - 1, 1, 1, - 1, - 1, 1, - 1,
	- 1, - 1, 1, 1, - 1, 1, 1, 1, 1, - 1, 1, 1,
];
const indicesOfFaces = [
	2, 1, 0, 0, 3, 2,
	0, 4, 7, 7, 3, 0,
	0, 1, 5, 5, 4, 0,
	1, 2, 6, 6, 5, 1,
	2, 3, 7, 7, 6, 2,
	4, 5, 6, 6, 7, 4,
];

const mainTreeTopGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 20, 5 ); // verticesOfCube, indicesOfFaces, radius, detail
mainTreeTopGeometry.scale(1.2, 1, 1.2);
const mainTreeTopMaterial = new THREE.MeshPhongMaterial({ color: 0xB6EEA7 });
const mainTreeTop = new THREE.Mesh(mainTreeTopGeometry, mainTreeTopMaterial);
mainTreeTop.position.set(0,80,0);
scene.add(mainTreeTop);

// Rama 1

const mainTreeBranch1Geometry = new THREE.CylinderGeometry(2, 2, 18, 20); // radiusTop, radiusBottom, height, radialSegments
const mainTreeBranch1Material = new THREE.MeshPhongMaterial({ color: 0xBCAEA1 });
const mainTreeBranch1 = new THREE.Mesh(mainTreeBranch1Geometry, mainTreeBranch1Material);
mainTreeBranch1.position.set(0,50,15);
mainTreeBranch1.rotation.x = Math.PI / 4;
scene.add(mainTreeBranch1);

const mainTreeBranch1TopGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 4, 5 ); // verticesOfCube, indicesOfFaces, radius, detail
mainTreeBranch1TopGeometry.scale(1.2, 1, 1.2);
const mainTreeBranch1TopMaterial = new THREE.MeshPhongMaterial({ color: 0xB6EEA7 });
const mainTreeBranch1Top = new THREE.Mesh(mainTreeBranch1TopGeometry, mainTreeBranch1TopMaterial);
mainTreeBranch1Top.position.set(0,55,19);
scene.add(mainTreeBranch1Top);

// Configuraciones y generación del resto de árboles

// Ciclo de día y noche
// Colores y luces
const colorStart = new THREE.Color("#87ceeb");
const colorEnd = new THREE.Color("#5769ad");

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2); // Luz intensa
const moonLight = new THREE.DirectionalLight(0x8888ff, 0.6); // Luz tenue y azulada

scene.add(sunLight);
scene.add(moonLight);

// Easing
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Hora del sistema como fracción del ciclo de 24 horas
function getTimeFraction() {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  console.log(now);
  console.log(hours);
  console.log(((hours + 15 - 12 + 24) % 24) / 24);
  return ((hours + 15 - 12 + 24) % 24) / 24; // 12:00 p.m. = 0, 12:00 a.m. = 0.5
}

const clock = new THREE.Clock(false);
const offset = getTimeFraction();
clock.start();

const radius = 1000;

function animateDayCycle() {
  requestAnimationFrame(animateDayCycle);

  const elapsed = clock.getElapsedTime();
  const t = (offset + elapsed / (24 * 60 * 60)) % 1; // Ciclo de 24h → valor 0–1
  const easedT = easeInOut(t);

  // Actualizamos el fondo
  const backgroundColor = colorStart.clone().lerp(colorEnd, easedT);
  scene.background = backgroundColor;

  // Ángulo en radianes (12:00 p.m. = 0 rad, 12:00 a.m. = PI rad)
  const angle = t * 2 * Math.PI;

  // Posiciones en el plano XY (Z se mantiene en 0)
  const sunX = radius * Math.sin(angle);
  const sunY = radius * Math.cos(angle);

  const moonX = -sunX;
  const moonY = -sunY;

  // Actualizamos posiciones
  sunLight.position.set(sunX, sunY, 0);
  moonLight.position.set(moonX, moonY, 0);

  // Apuntan al centro
  sunLight.target.position.set(0, 0, 0);
  moonLight.target.position.set(0, 0, 0);
  scene.add(sunLight.target);
  scene.add(moonLight.target);

  renderer.render(scene, camera);
}
animateDayCycle();

// ¿Partículas como nieve?


createRoot(document.getElementById('root')).render(
  renderer.render(scene, camera)
)
