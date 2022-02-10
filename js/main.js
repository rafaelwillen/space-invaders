import {
  Clock,
  Vector3,
  Box3,
  MathUtils,
  PointLightHelper,
} from "./library/three.module.js";

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
const pointsLights = [];
const keyboard = new KeyboardState();
let selectedCamera;
let startGame = false;
let bullets = [];
let enableSceneWireframe = false;

/**
 * @type {EnemyShip[]}
 */
let enemiesShips = [];
const playerShip = new PlayerShip();

document.querySelector("#start-btn").addEventListener("click", () => {
  const gameMenu = document.querySelector(".game-menu");
  gameMenu.style.display = "none";
  startGame = true;
  start();
});

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
  scenario.name = "gameScenario";
  scenario.rotateY(MathUtils.degToRad(180));
  scene.add(scenario);

  const lightHeight = 5;
  const leftWallLightSourcePosition = new Vector3(85, lightHeight, 0);
  const rightWallLightSourcePosition = new Vector3(-85, lightHeight, 0);

  pointsLights.push(
    LightBuilder.buildPointLight(leftWallLightSourcePosition),
    LightBuilder.buildPointLight(rightWallLightSourcePosition)
  );

  pointsLights.forEach((pointLight) => {
    pointLight.visible = false;
    const lightHelper = new PointLightHelper(pointLight, 1);
    scene.add(pointLight);
    scene.add(lightHelper);
  });
  pointsLights[0].visible = true;
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
  window.addEventListener("keydown", handleSceneWireframeToggle);
  update();
}

/**
 * Responsável por renderizar a cena e os seus objetos. Chamada a cada frame
 */
function update() {
  const delta = clock.getDelta();
  // Move 0.1 pixeis por segundo
  const moveDistance = 30 * delta;

  const scenario = scene.getObjectByName("gameScenario");
  scenario.children.forEach((child) => {
    child.material.wireframe = enableSceneWireframe;
  });

  // Buscar a referência do jogador
  const playerShipObject = scene.getObjectByName("player");
  // Criar a Bounding Box do jogador
  const playerShipBox = new Box3().setFromObject(playerShipObject);
  // Armazena as posições das paredes
  const wallPositions = ["right", "left", "back", "front"];

  // Cria as Bounding Boxes de cada parede
  const wallsBox = wallPositions.map((position) => {
    const wall = scene.getObjectByName(`${position}Wall`);
    return new Box3().setFromObject(wall);
  });

  // Deteção Parede x Jogador
  wallsBox.forEach((wallBox, index) => {
    if (playerShipBox.intersectsBox(wallBox)) {
      // console.log(`Jogador colidiu com parede ${wallPositions[index]}`);
    }
  });

  // Cria as Bounding Boxes para cada nave inimiga
  const enemyShipBox = enemiesShips.map((enemyShip) =>
    new Box3().setFromObject(enemyShip.shipObject)
  );

  // Deteção de colisão Nave Inimiga x Nave Inimiga
  for (let i = 0; i < enemyShipBox.length; i++) {
    for (let j = 0; j < enemyShipBox.length; j++) {
      if (i !== j && enemyShipBox[i].intersectsBox(enemyShipBox[j])) {
        // console.log("Nave inimiga colidiu com nave inimiga");
      }
    }
  }

  // Criação das Bounding Box das balas
  const bulletsBox = bullets.map((bullet) => new Box3().setFromObject(bullet));
  // Deteção de colisão das balas com o jogador
  bulletsBox.forEach((bulletBox, bulletIndex) => {
    if (bulletBox.intersectsBox(playerShipBox)) {
      console.log("Bala colidiu com nave do herói");
      bulletsBox.splice(bulletIndex, 1);
      bullets.splice(bulletIndex, 1);
      scene.remove(bullets[bulletIndex]);

      // Aumentar e dimuir vida no heroi
    }
  });
  // Deteção de colisão das balas com as paredes
  bulletsBox.forEach((bulletBox, bulletIndex) => {
    wallsBox.forEach((wallBox) => {
      if (wallBox.intersectsBox(bulletBox)) {
        // console.log(`Bala colidiu com a parede ${wallPositions[index]}`);
        bulletsBox.splice(bulletIndex, 1);
        bullets.splice(bulletIndex, 1);
        scene.remove(bullets[bulletIndex]);
        scene.remove(bullets[bulletIndex]);
        scene.remove(bullets[bulletIndex]);
        scene.remove(bullets[bulletIndex]);
        scene.remove(bullets[bulletIndex]);
      }
    });
  });
  // Deteção de colisão das balas com as naves inimigas
  bulletsBox.forEach((bulletBox, bulletIndex) => {
    enemyShipBox.forEach((enemy, index) => {
      if (bullets[bulletIndex].whoFired === "Enemy") return;
      if (bulletBox.intersectsBox(enemy)) {
        console.log(`Bala colidiu com uma nave inimiga ${index}`);

        // Remover a Bala
        bulletsBox.splice(bulletIndex, 1);
        bullets.splice(bulletIndex, 1);
        scene.remove(bullets[bulletIndex]);

        // newShips[index].removeFromParent();
        scene.remove(enemiesShips[index].shipObject);
        // Remover o inimigo da cena
        enemiesShips.splice(index, 1);
        enemyShipBox.splice(index, 1);
        // scene.remove(playerShipObject);
        // console.log(scene.children);
      }
    });
  });

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

  if (enemiesShips.length == 0) return;

  let index =
    enemiesShips.length === 1
      ? Math.floor(Math.random() * enemiesShips.length)
      : 0;
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
  switch (e.key.toLowerCase()) {
    case "q":
      if (!pointsLights[1].visible && pointsLights[0].visible) break;
      pointsLights[0].visible = !pointsLights[0].visible;
      pointsLights[1].visible = false;
      break;
    case "e":
      if (!pointsLights[0].visible && pointsLights[1].visible) break;
      pointsLights[1].visible = !pointsLights[1].visible;
      pointsLights[0].visible = false;
      break;
  }
}

function handleSceneWireframeToggle(e) {
  if (e.key.toLowerCase() === "w") {
    enableSceneWireframe = !enableSceneWireframe;
  }
}
