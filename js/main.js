const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = buildPerspectiveCamera();

const enemyShip = new EnemyShip();
const playerShip = new PlayerShip();

start();

function start() {
  document.body.appendChild(renderer.domElement);
  renderer.setSize(innerWidth, innerHeight);

  const playerShip3DObject = playerShip.create3DObject(10,10,10);
  scene.add(playerShip3DObject);
  enemyShip.shipObject.position.z = -20;
  scene.add(enemyShip.shipObject);
  playerShip.movePlayer(playerShip3DObject);

  update();
}

function update() {
  requestAnimationFrame(update);
  enemyShip.move(20);
  renderer.render(scene, camera);
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
