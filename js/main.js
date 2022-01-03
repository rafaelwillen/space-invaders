import { Clock, Vector3 } from "./library/three.module.js";

import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";
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
  const cameraDistanceToScene = 60;
  // Armazena as duas cameras do jogo: perspetiva e ortogonal
  const cameras = [
    CameraBuilder.buildPerspectiveCamera({
      y: cameraDistanceToScene,
      z: -cameraDistanceToScene,
      name: "perspective",
    }),
    CameraBuilder.buildOrthographicCamera({
      y: cameraDistanceToScene,
      z: -cameraDistanceToScene,
      name: "orthographic",
    }),
  ];

  // Adiciona cada camera na cena para ser referenciada pelo nome
  cameras.forEach((camera) => {
    camera.lookAt(scene.position);
    scene.add(camera);
  });
  // Por padrão, seleciona a camera de topo
  selectedCamera = cameras[0];

  // Cria o cenário
  const scenario = SceneBuilder.createScenario(100, 50);
  scene.add(scenario);

  // Cria a nave do herói
  const playerShip3DObject = playerShip.build();
  playerShip3DObject.position.set(0, 1.5, -20);
  playerShip3DObject.name = "player";
  scene.add(playerShip3DObject);

  const numberOfEnemyShips = 7;

  // Cria as naves dos vilões
  for (let i = 0; i < numberOfEnemyShips; i++) {
    // Gera posições das naves
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

  if (keyboard.pressed("ArrowLeft"))
    playerShip.movePlayer(playerShipObject, "right", moveDistance);
  if (keyboard.pressed("ArrowRight"))
    playerShip.movePlayer(playerShipObject, "left", moveDistance);
  if (keyboard.pressed("ArrowUp"))
    playerShip.movePlayer(playerShipObject, "front", moveDistance);
  if (keyboard.pressed("ArrowDown"))
    playerShip.movePlayer(playerShipObject, "back", moveDistance);
  if (keyboard.pressed(" ")) playerShip.shootPlayer(scene);

  updateEnemiesShips();

  renderer.render(scene, selectedCamera);
  requestAnimationFrame(update);
}

start();

/**
 * Atualiza as posições das naves inimigas
 */
function updateEnemiesShips() {
  enemiesShips.forEach((enemyShip) => {
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

/**
 * Adiciona responsividade na cena. Deve ser chamada em quando o evento 'resize' é disparado
 */
function windowResizeEvent() {
  selectedCamera.aspect = innerWidth / innerHeight;
  selectedCamera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

/**
 * Permite a mudança da camera selecionada
 */
function cameraChangeEvent(e) {
  // Tecla 5 -> Camera Fixa Perspetiva
  // Tecla 6 -> Camera Fixa Ortogonal
  switch (e.key) {
    case "5":
      selectedCamera = scene.getObjectByName("perspective");
      break;
    case "6":
      selectedCamera = scene.getObjectByName("orthographic");
      break;
  }
}
