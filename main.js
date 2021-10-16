import * as THREE from "three";
import { EnemyShip } from "./objects/ships/enemyShip";

function buildFundamentals() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    1,
    1000
  );
  camera.position.set(20, 20, 20);
  camera.lookAt(scene.position);
  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  renderer.setSize(innerWidth, innerHeight);
  return { scene, camera, renderer };
}

const { scene, camera, renderer } = buildFundamentals();

const enemyShip = new EnemyShip();
scene.add(enemyShip.ship);

renderer.render(scene, camera);
