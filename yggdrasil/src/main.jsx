import './i18n';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProfileProvider } from './context/ProfileContext';
import './index.css';
import App from './App.jsx';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Controladores helpers ELIMINAR

// Configuraciones generales de la escena 3D
var stars = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(20);
camera.position.setY(8);
camera.position.setZ(0);

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

  const soilRadius = 130;
  const soilSegments = 40;
  const soilThetaStart = 0;
  const soilThetaLength = Math.PI * 2;
  
  const soilCircleGeometry = new THREE.CircleGeometry(soilRadius, soilSegments, soilThetaStart, soilThetaLength);
  const soilCircleMaterial = new THREE.MeshPhongMaterial({ color: greenColor });
  const soilCircle = new THREE.Mesh(soilCircleGeometry, soilCircleMaterial);
  soilCircle.rotation.x = -Math.PI / 2;
  scene.add(soilCircle);
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

// Esferas para sol y luna
const sunGeometry = new THREE.DodecahedronGeometry(5, 2);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfdffb5 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const moonGeometry = new THREE.DodecahedronGeometry(3, 2);
const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xccecff });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Hora del sistema como fracción del ciclo de 24 horas
function getTimeFraction() {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  return ((hours - 12 + 24) % 24) / 24; // 12:00 p.m. = 0, 12:00 a.m. = 0.5
}

const clock = new THREE.Clock(false);
const offset = getTimeFraction();
clock.start();

const sunMoonRadius = 140;

function animateDayCycle() {
  requestAnimationFrame(animateDayCycle);

  const elapsed = clock.getElapsedTime();
  const t = (offset + elapsed / (24 * 60 * 60)) % 1; // Ciclo de 24h → valor 0–1 (puedo cambiar el divisor de 24*60*60 a 24 para más speed)
  //const easedT = easeInOut(t);
  const easedT = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI);

  // Actualizamos el fondo
  const backgroundColor = colorStart.clone().lerp(colorEnd, easedT);
  scene.background = backgroundColor;

  // Actualizamos las luces direccionales (para "eliminarlas" cuando están abajo del plano)
  sunLight.intensity = sunLightStart + (sunLightEnd - sunLightStart) * easedT;
  moonLight.intensity = moonLightStart + (moonLightEnd - moonLightStart) * easedT;

  // Actualizamos la opacidad de las estrellas
  for (var i = 0; i < stars.length; i++) {
    stars[i].material.opacity = easedT;
  }

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
  sun.position.set(sunX, sunY, 0);
  moon.position.set(moonX, moonY, 0);

  // Apuntan al centro
  sunLight.target.position.set(0, 0, 0);
  moonLight.target.position.set(0, 0, 0);
  scene.add(sunLight.target);
  scene.add(moonLight.target);

  renderer.render(scene, camera);
}
animateDayCycle();

/* ------------------------------ Configuraciones del árbol central ------------------------------ */
function mainTreeConfigurations(){
  // Tronco
  const trunkRadiusTop = 2.5;
  const trunkRadiusBottom = 2.5;
  const trunkHeight = 10;
  const trunkRadialSegments = 18;

  const mainTreeTrunkGeometry = new THREE.CylinderGeometry(trunkRadiusTop, trunkRadiusBottom, trunkHeight, trunkRadialSegments);
  const mainTreeTrunkMaterial = new THREE.MeshPhongMaterial({ color: brownColor });
  const mainTreeTrunk = new THREE.Mesh(mainTreeTrunkGeometry, mainTreeTrunkMaterial);
  mainTreeTrunk.position.set(0, trunkHeight / 2, 0);
  scene.add(mainTreeTrunk);

  // Copa
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

  // Rama 1
  const branchRadiusTop = 0.3;
  const branchRadiusBottom = 0.3;
  const branchHeight = 1.7;
  const branchRadialSegments = 8;

  const branchTopRadius = 0.6;
  const branchTopDetail = 3;

  const mainTreeBranchGeometry = new THREE.CylinderGeometry(branchRadiusTop, branchRadiusBottom, branchHeight, branchRadialSegments);
  const mainTreeBranchMaterial = new THREE.MeshPhongMaterial({ color: brownColor });
  const mainTreeBranch1 = new THREE.Mesh(mainTreeBranchGeometry, mainTreeBranchMaterial);
  mainTreeBranch1.position.set(0, 7.5, 2.8);
  mainTreeBranch1.rotation.x = Math.PI / 4;
  scene.add(mainTreeBranch1);

  const mainTreeBranchTopGeometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, branchTopRadius, branchTopDetail);
  mainTreeBranchTopGeometry.scale(1.2, 1, 1.2);
  const mainTreeBranchTopMaterial = new THREE.MeshPhongMaterial({ color: greenColor });
  const mainTreeBranch1Top = new THREE.Mesh(mainTreeBranchTopGeometry, mainTreeBranchTopMaterial);
  mainTreeBranch1Top.position.set(0, 8.28, 3.35);
  scene.add(mainTreeBranch1Top);

  // Rama 2
  const mainTreeBranch2 = new THREE.Mesh(mainTreeBranchGeometry, mainTreeBranchMaterial);
  mainTreeBranch2.position.set(0, 6.5, -2.8);
  mainTreeBranch2.rotation.x = -Math.PI / 4;
  scene.add(mainTreeBranch2);

  const mainTreeBranch2Top = new THREE.Mesh(mainTreeBranchTopGeometry, mainTreeBranchTopMaterial);
  mainTreeBranch2Top.position.set(0, 7.2, -3.35);
  scene.add(mainTreeBranch2Top);

  // Rama 3
  const mainTreeBranch3 = new THREE.Mesh(mainTreeBranchGeometry, mainTreeBranchMaterial);
  mainTreeBranch3.position.set(2.8, 3.5, 0);
  mainTreeBranch3.rotation.z = -Math.PI / 4;
  scene.add(mainTreeBranch3);

  const mainTreeBranch3Top = new THREE.Mesh(mainTreeBranchTopGeometry, mainTreeBranchTopMaterial);
  mainTreeBranch3Top.position.set(3.35, 4.15, 0);
  scene.add(mainTreeBranch3Top);

  // Rama 4
  const mainTreeBranch4 = new THREE.Mesh(mainTreeBranchGeometry, mainTreeBranchMaterial);
  mainTreeBranch4.position.set(-2.8, 5.5, 0);
  mainTreeBranch4.rotation.z = Math.PI / 4;
  scene.add(mainTreeBranch4);

  const mainTreeBranch4Top = new THREE.Mesh(mainTreeBranchTopGeometry, mainTreeBranchTopMaterial);
  mainTreeBranch4Top.position.set(-3.35, 6.1, 0);
  scene.add(mainTreeBranch4Top);
}
mainTreeConfigurations();

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

/* ------------------------------ Configuraciones de las estrellas ------------------------------ */
function starConfigurations(){
  const randomMaxX = 0
  const randomMinX = Math.PI * 2;
  const randomMaxY = 0
  const randomMinY = Math.PI / 2;
  
  const angX = Math.random() * (randomMaxX - randomMinX) + randomMinX;
  const angY = Math.random() * (randomMaxY - randomMinY) + randomMinY;
  
  const starGeometry = new THREE.DodecahedronGeometry(0.4, 1);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.material.transparent = true;
  star.position.set((140 * Math.cos(angY)) * Math.cos(angX), 140 * Math.sin(angY), (140 * Math.cos(angY)) * Math.sin(angX));
  scene.add(star);
  stars.push(star);
}

for(i = 0; i < 150; i++){
  starConfigurations();
}

/* ------------------------------ Rotación de la cámara ------------------------------ */
// Centro de rotación
const center = new THREE.Vector3(0, 10, 0);
const radius = 20;
let angle = 0; // En radianes
const speed = 0.005; // Controla la velocidad de rotación

// Variables para scroll
let scrollPercent = 0;
let targetCamY = 15;
let currentCamY = 15;

let targetLookAtY = 5;
let currentLookAtY = 5;

// Escuchar scroll
window.addEventListener('scroll', () => {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  scrollPercent = window.scrollY / maxScroll;

  // Mapea el scroll del 0 al 1 en los rangos deseados
  targetCamY = 15 - scrollPercent * 10; // de 15 a 5
  targetLookAtY = 7 + scrollPercent * 6; // de 7 a 13
});

function cameraAnimate(){
    requestAnimationFrame(cameraAnimate);
  
    // Actualizamos el ángulo:
    angle -= speed;

    // Easing (lerp)
    currentCamY += (targetCamY - currentCamY) * 0.05;
    currentLookAtY += (targetLookAtY - currentLookAtY) * 0.05;

    // Posicionamos la cámara en círculo:
    camera.position.x = center.x + radius * Math.cos(angle);
    camera.position.z = center.z + radius * Math.sin(angle);
    camera.position.y = currentCamY;

    // Hacemos que siempre mire al centro:
    camera.lookAt(new THREE.Vector3(0, currentLookAtY, 0));

    renderer.render(scene,camera);
}

cameraAnimate();


// Reajuste de ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.render(scene, camera);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </StrictMode>
)
