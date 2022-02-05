import { Clock, Vector3, Box3 } from "./library/three.module.js";

import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";
import EnemyShip from "./ships/enemyShip.js";
import PlayerShip from "./ships/playerShip.js";
import { generateRandomPosition } from "./utilities/movement.js";
import KeyboardState from "./utilities/keyboardState.js";
import { getRandomColor } from "./utilities/randomColor.js";
import LightBuilder from "./scene/lightBuilder.js";

const { scene, renderer } = SceneBuilder.createEssentials();
const clock = new Clock();
const directionalLight = LightBuilder.buildDirectionalLight();
const spotLights = [];
const keyboard = new KeyboardState();
let selectedCamera;
let bullets = [];

/**
 * @type {EnemyShip[]}
 */
const enemiesShips = [];
const playerShip = new PlayerShip();

/**
 * Cria todos os objetos da cena. Chamado apenas uma vez
 */
function start() {
  const cameraDistanceToScene = 100;
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
  const scenario = SceneBuilder.createScenario(180, 100);
  scene.add(scenario);

  scene.add(directionalLight);

  const lightHeight = 30;
  const topLeftLightSourcePosition = new Vector3(110, lightHeight, 80);
  const topRightLightSourcePosition = new Vector3(-110, lightHeight, 80);
  const bottomLeftLightSourcePosition = new Vector3(100, lightHeight, -80);
  const bottomRightLightSourcePosition = new Vector3(-100, lightHeight, -80);

  spotLights.push(
    LightBuilder.buildSpotLight(topLeftLightSourcePosition),
    LightBuilder.buildSpotLight(topRightLightSourcePosition),
    LightBuilder.buildSpotLight(bottomLeftLightSourcePosition),
    LightBuilder.buildSpotLight(bottomRightLightSourcePosition)
  );

  spotLights.forEach((spotLight) => {
    spotLight.visible = false;
    spotLight.target = scene;
    scene.add(spotLight);
  });
  document.addEventListener("keypress", onLightVisibilityToggle);

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
      new EnemyShip(getRandomColor(), getRandomColor(), 0.4, {
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
  const moveDistance = 30 * delta;
  const playerShipObject = scene.getObjectByName("player");
  const playerShipBox = new Box3().setFromObject(playerShipObject);

  ["right", "left", "back", "front"].forEach((position) => {
    const wall = scene.getObjectByName(`${position}Wall`);
    const box = new Box3().setFromObject(wall);
    if (playerShipBox.intersectsBox(box)) {
      console.log(`Player colides with ${position} wall`);
    }
  });

  const enemyShipBox = enemiesShips.map((enemyShip) =>
    new Box3().setFromObject(enemyShip.shipObject)
  );

  for (let i = 0; i < enemyShipBox.length; i++) {
    for (let j = 0; j < enemyShipBox.length; j++) {
      if (i !== j && enemyShipBox[i].intersectsBox(enemyShipBox[j])) {
        console.log("Ship colide with Ship");
      }
    }
  }

  for (let index = 0; index < bullets.length; index++) {
    if (bullets[index] === undefined) continue;
    if (bullets[index].alive == false) {
      bullets.splice(index, 1);
      continue;
    }

    bullets[index].position.add(bullets[index].velocity);
  }

  if (keyboard.pressed("ArrowLeft"))
    playerShip.movePlayer(playerShipObject, "right", moveDistance);
  if (keyboard.pressed("ArrowRight"))
    playerShip.movePlayer(playerShipObject, "left", moveDistance);
  if (keyboard.pressed("ArrowUp"))
    playerShip.movePlayer(playerShipObject, "front", moveDistance);
  if (keyboard.pressed("ArrowDown"))
    playerShip.movePlayer(playerShipObject, "back", moveDistance);
  if (keyboard.pressed(" ") && playerShip.canShot <= 0)
    playerShip.shootPlayer(scene, bullets);
  else {
    if (playerShip.canShot > 0) playerShip.canShot -= 10;
  }

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

  let index = Math.floor(Math.random() * 2);
  if (enemiesShips[index].canShot) {
    if (enemiesShips[index].canShot <= 0) {
      setTimeout(() => {
        enemiesShips[index].shootEnemy(scene, bullets);
      }, 5000);
    } else enemiesShips[index].canShot -= 5;
  } else {
    enemiesShips[index].shootEnemy(scene, bullets);
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

function onLightVisibilityToggle(e) {
  switch (e.key) {
    case "q":
    case "Q":
      directionalLight.visible = !directionalLight.visible;
      break;
    case "1":
      spotLights[0].visible = !spotLights[0].visible;
      break;
    case "2":
      spotLights[1].visible = !spotLights[1].visible;
      break;
    case "3":
      spotLights[2].visible = !spotLights[2].visible;
      break;
    case "4":
      spotLights[3].visible = !spotLights[3].visible;
      break;
  }
}
