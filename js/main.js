function buildFundamentals() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    1,
    1000
  );
  camera.position.set(0, 0, 30);
  camera.lookAt(scene.position);
  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  renderer.setSize(innerWidth, innerHeight);
  return { scene, camera, renderer };
}

const { scene, camera, renderer } = buildFundamentals();

const enemyShip = new EnemyShip();
const ship = new PlayerShip();
const playerShip = ship.creaPlayerShip()
scene.add(enemyShip.ship);
scene.add(playerShip);

ship.movePlayer(playerShip);
let direction = "left";

function update() {
  requestAnimationFrame(update);
  const shipSpeed = 0.4;
  moveEnemyShip(shipSpeed);
  renderer.render(scene, camera);
}

function moveEnemyShip(speed) {
  // Até onde a nave chega no eixo x
  const threshold = 15;
  const shipPositionX = enemyShip.ship.position.x;
  // Se passar o threshold, a nave muda de direção
  if (shipPositionX >= threshold) direction = "left";
  else if (shipPositionX <= threshold * -1) direction = "right";
  enemyShip.move(direction, speed);
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

update();
