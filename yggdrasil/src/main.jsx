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

// Controladores helpers ELIMINAR
const controls = new OrbitControls(camera, renderer.domElement);
function animateControls(){
  requestAnimationFrame(animateControls);
  //torus.rotation.x += 0.01;
  renderer.render(scene, camera);
  controls.update();
};
animateControls();

// Constantes globales del entorno 3D
const greenColor = 0xB6EEA7;
const brownColor = 0xBCAEA1;

/* ------------------------------ Configuraciones del suelo ------------------------------ */
function soilConfigurations(){
  const soilWidth = 160;
  const soilHeight = 1;
  const soilDepth = 160;
  
  const soilGeometry = new THREE.BoxGeometry(soilWidth, soilHeight, soilDepth);
  const soilMaterial = new THREE.MeshPhongMaterial({ color: greenColor });
  const soil = new THREE.Mesh(soilGeometry, soilMaterial);
  soil.position.set(0, -soilHeight / 2, 0);
  scene.add(soil);
}
soilConfigurations();

/* ------------------------------ Configuraciones del ciclo de día y noche ------------------------------ */
// Colores y luces
const colorStart = new THREE.Color("#87ceeb");
const colorEnd = new THREE.Color("#5769ad");

const sunLightStart = 1.2; // Start es "a mediodía". Por eso la luz de sol tiene su valor más alto en Start y luna en End
const sunLightEnd = 0.01;
const moonLightStart = 0.01;
const moonLightEnd = 0.9;

const sunLight = new THREE.DirectionalLight(0xffffff, sunLightStart); // Luz intensa
const moonLight = new THREE.DirectionalLight(0x8888ff, moonLightStart); // Luz tenue y azulada
const ambientLight = new THREE.AmbientLight( 0x737373, 2 ); // Luz suave clara de apoyo en los atardeceres y amaneceres

scene.add(sunLight);
scene.add(moonLight);
scene.add(ambientLight);

// Easing
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Hora del sistema como fracción del ciclo de 24 horas
function getTimeFraction() {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  return ((hours - 12 + 24) % 24) / 24; // 12:00 p.m. = 0, 12:00 a.m. = 0.5
}

const clock = new THREE.Clock(false);
const offset = getTimeFraction();
clock.start();

const sunMoonRadius = 100;

function animateDayCycle() {
  requestAnimationFrame(animateDayCycle);

  const elapsed = clock.getElapsedTime();
  const t = (offset + elapsed / (24 * 60 * 60)) % 1; // Ciclo de 24h → valor 0–1
  //const easedT = easeInOut(t);
  const easedT = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);

  // Actualizamos el fondo
  const backgroundColor = colorStart.clone().lerp(colorEnd, easedT);
  scene.background = backgroundColor;

  // Actualizamos las luces direccionales (para "eliminarlas" cuando están abajo del plano)
  sunLight.intensity = sunLightStart + (sunLightEnd - sunLightStart) * easedT;
  moonLight.intensity = moonLightStart + (moonLightEnd - moonLightStart) * easedT;

  // Ángulo en radianes (12:00 p.m. = 0 rad, 12:00 a.m. = PI rad)
  const angle = t * 2 * Math.PI;

  // Posiciones en el plano XY (Z se mantiene en 0)
  const sunX = sunMoonRadius * Math.sin(angle);
  const sunY = sunMoonRadius * Math.cos(angle);

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

// Helpers de los puntos de luz
const sunLightHelper = new THREE.PointLightHelper(sunLight);
const moonLightHelper = new THREE.PointLightHelper(moonLight);
scene.add(sunLightHelper, moonLightHelper);

/* ------------------------------ Configuraciones del árbol central ------------------------------ */
function mainTreeConfigurations(){
  const trunkRadiusTop = 2.5;
  const trunkRadiusBottom = 2.5;
  const trunkHeight = 10;
  const trunkRadialSegments = 18;

  const mainTreeTrunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, trunkRadialSegments);
  const mainTreeTrunkMaterial = new THREE.MeshPhongMaterial({ color: brownColor });
  const mainTreeTrunk = new THREE.Mesh(mainTreeTrunkGeometry, mainTreeTrunkMaterial);
  mainTreeTrunk.position.set(0, trunkHeight / 2, 0);
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

  const mainTreeTopDetail = 5;

  const mainTreeTopGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, trunkRadiusTop * 2, mainTreeTopDetail);
  mainTreeTopGeometry.scale(1.2, 1, 1.2);
  const mainTreeTopMaterial = new THREE.MeshPhongMaterial({ color: greenColor });
  const mainTreeTop = new THREE.Mesh(mainTreeTopGeometry, mainTreeTopMaterial);
  mainTreeTop.position.set(0, trunkHeight * 1.4, 0);
  scene.add(mainTreeTop);
}
mainTreeConfigurations();

/*
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
*/

/* ------------------------------ Configuraciones de populación de los demás arbolitos ------------------------------ */
function littleTreeConfigurations(posX, posZ){
  const randomMax = 3.5;
  const randomMin = 1.5;
  
  const trunkRadiusTop = 0.5;
  const trunkRadiusBottom = 0.5;
  const trunkHeight = Math.random() * (randomMax - randomMin) + randomMin;
  const trunkRadialSegments = 10;

  const littleTreeTrunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, trunkRadialSegments);
  const littleTreeTrunkMaterial = new THREE.MeshPhongMaterial({ color: brownColor });
  const littleTreeTrunk = new THREE.Mesh(littleTreeTrunkGeometry, littleTreeTrunkMaterial);
  littleTreeTrunk.position.set(posX, trunkHeight / 2, posZ);
  scene.add(littleTreeTrunk);

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

  const littleTreeTopDetail = 3;

  const littleTreeTopGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, trunkRadiusTop * 2, littleTreeTopDetail);
  littleTreeTopGeometry.scale(1.2, 1, 1.2);
  const littleTreeTopMaterial = new THREE.MeshPhongMaterial({ color: greenColor });
  const littleTreeTop = new THREE.Mesh(littleTreeTopGeometry, littleTreeTopMaterial);
  littleTreeTop.position.set(posX, trunkHeight * 1.2, posZ);
  scene.add(littleTreeTop);
}
const randomMaxPosBias = 3;
const randomMinPosBias = -3;
var i;
var j;
for(i = -8; i < 8; i++){
  for(j = -8; j < 8; j++){
    if((i >= -2 && i <= 1) && (j >= -2 && j <= 1)){
      continue;
    }
    littleTreeConfigurations(10 * i + 5 + Math.random() * (randomMaxPosBias - randomMinPosBias) + randomMinPosBias,
                             10 * j + 5 + Math.random() * (randomMaxPosBias - randomMinPosBias) + randomMinPosBias);
  }
}

/* ------------------------------ ¿Partículas como nieve? ------------------------------ */



// Reajuste de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


createRoot(document.getElementById('root')).render(
  renderer.render(scene, camera)
)
