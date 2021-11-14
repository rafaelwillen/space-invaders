import SceneBuilder from "./scene/sceneBuilder.js";
import CameraBuilder from "./scene/cameraBuilder.js";

const { scene, renderer } = SceneBuilder.createEssentials();
let selectedCamera;

function start() {
  // Armazena as três cameras do jogo: frontal, de topo, lateral
  const cameras = [];
}

function update() {}

start();

// const { scene, renderer } = SceneBuilder.createEssentials();
// let selectedCamera;

// const enemyShip = new EnemyShip();
// const playerShip = new PlayerShip();

// start();

// /**
//  * Cria todos os objetos da cena. Chamada apenas uma vez
//  */
// function start() {
//   // Armazena as três câmeras do jogo: frontal, de topo, lateral
//   const cameras = [
//     CameraBuilder.buildPerspectiveCamera({
//       z: 25,
//       y: 8,
//       rotationX: Math.PI * -0.1,
//       name: "front",
//     }),
//     CameraBuilder.buildPerspectiveCamera({
//       x: 20,
//       y: 3,
//       name: "side",
//       rotationX: Math.PI * -0.5,
//       rotationY: Math.PI * 0.44,
//       rotationZ: Math.PI * 0.5,
//     }),
//     CameraBuilder.buildPerspectiveCamera({
//       y: 22.5,
//       name: "top",
//       rotationX: Math.PI * -0.5,
//     }),
//   ];
//   // Adiciona cada câmera na cena para ser referenciada pelo nome
//   cameras.forEach((camera) => {
//     // camera.lookAt(scene.position);
//     scene.add(camera);
//   });
//   // Por padrão, seleciona a câmera frontal
//   selectedCamera = cameras[0];

//   // Cria o piso
//   const floor = SceneBuilder.createFloor(60, 30);
//   scene.add(floor);

//   // Cria a nave do herói
//   const playerShip3DObject = playerShip.create3DObject(2, 1, 3);
//   playerShip3DObject.position.set(0, 1.5, -8);
//   playerShip.movePlayer(playerShip3DObject, 20);
//   scene.add(playerShip3DObject);

//   // Cria a nave do vilão
//   enemyShip.shipObject.position.set(0, 1.5, 12);
//   scene.add(enemyShip.shipObject);

//   update();
// }

// /**
//  * Responsável por renderizar a cena e os seus objetos. Chamada a cada frame
//  */
// function update() {
//   requestAnimationFrame(update);
//   // Move a nave inimiga sem nenhum input do utilizador. O limite do movimento é de -20 até 20
//   enemyShip.move(20);
//   renderer.render(scene, selectedCamera);
// }

// // Adiciona responsividade na cena
// window.addEventListener(
//   "resize",
//   () => {
//     selectedCamera.aspect = innerWidth / innerHeight;
//     selectedCamera.updateProjectionMatrix();
//     renderer.setSize(innerWidth, innerHeight);
//   },
//   false
// );

// // Evento responsável pela mudança de câmeras
// window.addEventListener("keydown", (e) => {
//   // Tecla 1 -> Câmera frontal
//   // Tecla 2 -> Câmera lateral
//   // Tecla 3 -> Câmera de topo
//   switch (e.key) {
//     case "1":
//       selectedCamera = scene.getObjectByName("front");
//       break;
//     case "2":
//       selectedCamera = scene.getObjectByName("side");
//       break;
//     case "3":
//       selectedCamera = scene.getObjectByName("top");
//       break;
//   }
// });
