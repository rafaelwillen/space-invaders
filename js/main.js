import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";
import EnemyShip from "./ships/enemyShip.js";
import PlayerShip from "./ships/playerShip.js";

const { scene, renderer } = SceneBuilder.createEssentials();
let selectedCamera;

const enemyShip = new EnemyShip();
const playerShip = new PlayerShip();

/**
 * Cria todos os objetos da cena. Chamado apenas uma vez
 */
function start() {
  // Armazena as três cameras do jogo: frontal, de topo, lateral
  const cameras = [
    CameraBuilder.buildPerspectiveCamera({
      z: 75,
      y: 35,
      rotationX: Math.PI * -0.1,
      name: "front",
    }),
    CameraBuilder.buildPerspectiveCamera({
      x: 80,
      y: 15,
      name: "side",
      rotationX: Math.PI * -0.5,
      rotationY: Math.PI * 0.44,
      rotationZ: Math.PI * 0.5,
    }),
    CameraBuilder.buildPerspectiveCamera({
      y: 80,
      name: "top",
      rotationX: Math.PI * -0.5,
    }),
  ];

  // Adiciona cada camera na cena para ser referenciada pelo nome
  cameras.forEach((camera) => {
    camera.lookAt(scene.position);
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
  enemyShip.move({ x: -20, z: 3 });
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
  // Tecla 1 -> Câmera frontal
  // Tecla 2 -> Câmera lateral
  // Tecla 3 -> Câmera de topo
  switch (e.key) {
    case "1":
      selectedCamera = scene.getObjectByName("front");
      break;
    case "2":
      selectedCamera = scene.getObjectByName("side");
      break;
    case "3":
      selectedCamera = scene.getObjectByName("top");
      break;
  }
}
