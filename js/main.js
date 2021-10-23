const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
let selectedCamera;

const enemyShip = new EnemyShip();
const playerShip = new PlayerShip();

start();

/**
 * Cria todos os objetos da cena. Chamada apenas uma vez
 */
function start() {
  // Adiciona o renderizador na DOM
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

  // Cria a nave do herói
  const playerShip3DObject = playerShip.create3DObject(10, 10, 10);
  playerShip.movePlayer(playerShip3DObject);
  scene.add(playerShip3DObject);

  // Cria a nave do vilão
  enemyShip.shipObject.position.z = -20;
  scene.add(enemyShip.shipObject);

  update();
}

/**
 * Responsável por renderizar a cena e os seus objetos. Chamada a cada frame
 */
function update() {
  requestAnimationFrame(update);
  // Move a nave inimiga sem nenhum input do utilizador. O limite do movimento é de -20 até 20
  enemyShip.move(20);
  renderer.render(scene, selectedCamera);
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
