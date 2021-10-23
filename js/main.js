const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
let selectedCamera;

const enemyShip = new EnemyShip();
const playerShip = new PlayerShip();

start();

function start() {
  document.body.appendChild(renderer.domElement);
  renderer.setSize(innerWidth, innerHeight);

  // Armazena as três câmeras do jogo: frontal, de topo, lateral
  const cameras = [
    CameraBuilder.buildPerspectiveCamera({ z: 40, name: "front" }),
    CameraBuilder.buildPerspectiveCamera({ x: 40, name: "side" }),
    CameraBuilder.buildPerspectiveCamera({ y: 40, name: "top" }),
  ];
  // Adiciona cada câmera na cena para ser referenciada pelo nome
  cameras.forEach((camera) => {
    camera.lookAt(scene.position);
    scene.add(camera);
  });
  // Por padrão, seleciona a câmera frontal
  selectedCamera = cameras[0];

  const playerShip3DObject = playerShip.create3DObject(10, 10, 10);
  scene.add(playerShip3DObject);
  enemyShip.shipObject.position.z = -20;
  scene.add(enemyShip.shipObject);
  playerShip.movePlayer(playerShip3DObject);

  update();
}

function update() {
  requestAnimationFrame(update);
  enemyShip.move(20);
  renderer.render(scene, selectedCamera);
}

function buildPerspectiveCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 30);
  camera.lookAt(scene.position);
  camera.name = "main-camera";
  return camera;
}

// Adiciona responsividade na cena
window.addEventListener(
  "resize",
  () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  },
  false
);

// Evento responsável pela mudança de câmeras
window.addEventListener("keydown", (e) => {
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
});
