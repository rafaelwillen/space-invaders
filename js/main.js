import { Clock, Vector3 } from "./library/three.module.js";

import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";
import CameraControls from "./scene/cameraControls.js";
import EnemyShip from "./ships/enemyShip.js";
import PlayerShip from "./ships/playerShip.js";
import { generateRandomPosition } from "./utilities/movement.js";
import KeyboardState from "./utilities/keyboardState.js";
import { getRandomColor } from "./utilities/randomColor.js";

const { scene, renderer } = SceneBuilder.createEssentials();
const clock = new Clock();
const keyboard = new KeyboardState();
let selectedCamera;

/**
 * @type {EnemyShip[]}
 */
const enemiesShips = [];
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
      rotationZ: Math.PI,
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
    camera.lookAt(scene.position);
    scene.add(camera);
  });
  // Por padrão, seleciona a camera frontal
  selectedCamera = cameras[0];

  // Cria o cenário
  const scenario = SceneBuilder.createScenario(100, 50);
  scene.add(scenario);

  // Cria a nave do herói
  const playerShip3DObject = playerShip.build();
  playerShip3DObject.position.set(0, 1.5, -20);
  playerShip3DObject.name = "player";
  scene.add(playerShip3DObject);

  // Cria as naves dos vilões
  for (let i = 0; i < 8; i++) {
    const xPosition = (100 - 22 * (i + 1)) / 2;
    const zPosition = 20;
    enemiesShips.push(
      new EnemyShip(getRandomColor(), getRandomColor(), 0.1, {
        x: xPosition,
        z: zPosition,
      })
    );
  }
  // Adiciona as naves na cena
  enemiesShips.forEach((enemyShip) => {
    scene.add(enemyShip.shipObject);
  });

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
  const delta = clock.getDelta();
  // Move 0.1 pixeis por segundo
  const moveDistance = 15 * delta;
  const playerShipObject = scene.getObjectByName("player");
  if (selectedCamera.name === "dynamic360") {
    CameraControls.rotateAroundScene(selectedCamera, scene.position);
  } else if (selectedCamera.name === "dynamicBullet") {
    // TODO: Mudar isto para ser a bala
    CameraControls.followObject(selectedCamera, playerShipObject, 5);
  }
  movePlayerShip(playerShipObject, moveDistance);

  updateEnemiesShips();

  renderer.render(scene, selectedCamera);
  requestAnimationFrame(update);
}

start();

/**
 * Atualiza as posições das naves inimigas
 */
function updateEnemiesShips() {
  enemiesShips.forEach((enemyShip, index) => {
    let newDestination;
    if (!enemyShip.isMoving()) {
      // Calcula uma nova posição
      newDestination = generateRandomPosition();
      enemyShip.setIsMoving(true);
    } else {
      // Continua a se mover na posição definida
      const { x, z } = enemyShip.getDestination();
      newDestination = new Vector3(x, 1.5, z);
    }
    enemyShip.move(newDestination);
  });
}

function movePlayerShip(player, moveDistance) {
  const xConstraint = 45;
  // Move 0.1 pixeis por segundo
  if (keyboard.pressed("ArrowLeft")) {
    if (player.position.x <= xConstraint)
      playerShip.movePlayer(player, "right", moveDistance);
  }
  if (keyboard.pressed("ArrowRight")) {
    if (player.position.x >= -xConstraint)
      playerShip.movePlayer(player, "left", moveDistance);
  }
  if (keyboard.pressed("ArrowUp")) {
    if (player.position.z <= -5)
      playerShip.movePlayer(player, "front", moveDistance);
  }
  if (keyboard.pressed("ArrowDown")) {
    if (player.position.z >= -21)
      playerShip.movePlayer(player, "back", moveDistance);
  }
}

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
