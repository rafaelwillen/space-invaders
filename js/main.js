import { PerspectiveCamera, Vector3 } from "./library/three.module.js";

import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";
import EnemyShip from "./ships/enemyShip.js";
import PlayerShip from "./ships/playerShip.js";

const { scene, renderer } = SceneBuilder.createEssentials();
let selectedCamera;

const CameraControls = {
  /**
   * Faz com que uma camera perspetiva gire em torno da cena
   * @param {PerspectiveCamera} camera A camera
   * @param {Vector3} scenePosition A posição da cena
   */
  rotateAroundScene(camera, scenePosition) {
    // Velocidade de rotação
    const rotationSpeed = 0.01;
    const { x, z } = camera.position;
    camera.position.x =
      x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
    camera.position.z =
      z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed);
    camera.lookAt(scenePosition);
  },
};

const enemyShip = new EnemyShip();
const playerShip = new PlayerShip();

/**
 * Cria todos os objetos da cena. Chamado apenas uma vez
 */
function start() {
  // Armazena as três cameras do jogo: frontal, de topo, lateral
  const cameras = [
    //TODO: Mudar para ortogonal
    CameraBuilder.buildPerspectiveCamera({
      y: 80,
      name: "top",
      rotationX: Math.PI * -0.5,
    }),
    CameraBuilder.buildPerspectiveCamera({
      z: 75,
      y: 35,
      rotationX: Math.PI * -0.1,
      name: "dynamic360",
    }),
    CameraBuilder.buildPerspectiveCamera({
      x: 0,
      y: 15,
      name: "dynamicBullet",
      rotationX: Math.PI * -0.5,
      rotationY: Math.PI * 0.44,
      rotationZ: Math.PI * 0.5,
    }),
  ];

  // Adiciona cada camera na cena para ser referenciada pelo nome
  cameras.forEach((camera) => {
    scene.add(camera);
  });
  // Por padrão, seleciona a camera frontal
  selectedCamera = cameras[2];

  // Cria o cenário
  const scenario = SceneBuilder.createScenario(100, 50);
  scene.add(scenario);

  // Cria a nave do herói
  const playerShip3DObject = playerShip.build();
  // TODO: Ajustar a posição da nave do herói
  playerShip3DObject.position.set(0, 1.5, -8);
  playerShip.movePlayer(playerShip3DObject, 20);
  scene.add(playerShip3DObject);

  // Cria a nave do vilão
  // TODO: Ajustar a posição da nave do inimigo
  enemyShip.shipObject.position.set(0, 1.5, 12);
  scene.add(enemyShip.shipObject);

  // Adiciona responsividade na cena
  window.addEventListener("resize", windowResizeEvent);
  // Responsável pela mudança de cameras
  window.addEventListener("keydown", cameraChangeEvent);
  update();
}

/**
 * Responsável por renderizar a cena e os seus objetos. Chamada a cada frame
 */
function update() {
  requestAnimationFrame(update);
  if (selectedCamera.name === "dynamic360") {
    CameraControls.rotateAroundScene(selectedCamera, scene.position);
  } else if (selectedCamera.name === "dynamicBullet") {
    console.log("Bullet Camera");
  }

  renderer.render(scene, selectedCamera);
}

start();

/**
 * Adiciona responsividade na cena. Deve ser chamada em quando o evento 'resize' é disparado
 */
function windowResizeEvent() {
  selectedCamera.aspect = innerWidth / innerHeight;
  selectedCamera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

/**
 * Permite a mudança da camera selecionada. Suporta três cameras (frontal, lateral, topo). Deve ser chamada em quando o evento 'keydown' é disparado
 */
function cameraChangeEvent(e) {
  // Tecla 1 -> Camera Dinâmica 360º
  // Tecla 2 -> Camera Dinâmica da bala
  // Tecla 3 -> Camera de topo
  switch (e.key) {
    case "1":
      selectedCamera = scene.getObjectByName("top");
      break;
    case "2":
      selectedCamera = scene.getObjectByName("dynamic360");
      break;
    case "3":
      selectedCamera = scene.getObjectByName("dynamicBullet");
      break;
  }
}
