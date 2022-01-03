import Bullet from "../components/Bullet.js";
import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Math,
  Object3D,
  Vector3,
} from "../library/three.module.js";

const shipGroup = new Group();
class PlayerShip {
  constructor(){
    this.canShot = 0;
  }
  build() {
    // O objeto nave
    // A carcaça da nave
    const hull = new Group();
    // Retângulo principal
    const bodyRectangle = buildBodyRect();
    // Cockpit da nave
    const cockpit = buildCockpit();
    cockpit.position.set(0, 0, 2.5);

    // Asa Esquerda
    const leftWing = buildWing(true);
    // Asa direita
    const rightWing = buildWing(false);

    // Propulsor Esquerdo
    const leftThruster = buildThruster(true);
    // Propulsor Direito
    const rightThruster = buildThruster(false);
    const thrusters = [leftThruster, rightThruster];

    // As armas
    const topWeapon = buildWeapon("top");
    const rightWeapon = buildWeapon("right");
    const leftWeapon = buildWeapon("left");
    const weapons = [topWeapon, rightWeapon, leftWeapon];

    // Adiciona os objetos na nave
    hull.add(bodyRectangle, cockpit);
    shipGroup.add(hull, ...thrusters, leftWing, rightWing, ...weapons);
    shipGroup.scale.set(0.5, 0.5, 0.5);
    return shipGroup;
  }

  /**
   * Move o jogador
   * @param {Object3D} player A nave do jogador
   * @param {"right" | "left"|"front"|"back"} movement A direção do movimento
   * @param {number} speed A velocidade
   */
  movePlayer(player, movement, speed) {
    switch (movement) {
      case "right":
        player.translateX(speed);
        break;
      case "left":
        player.translateX(-speed);
        break;
      case "front":
        player.translateZ(speed);
        break;
      case "back":
        player.translateZ(-speed);
        break;
    }
  }

  shootPlayer(scene,bullets) {
    const bullet = new Bullet();
    bullet.position.set(
      shipGroup.position.x,
      shipGroup.position.y,
      shipGroup.position.z
    )
    bullet.velocity = new Vector3(0,0,0.5);

    setTimeout(() => {
      bullet.alive = false;
      scene.remove(bullet);
    }, 2000);

      this.canShot = 100;
      bullets.push(bullet);
      scene.add(bullet);
    
  }
}

/**
 * Constrói o principal retângulo da nave. Por defeito é vermelho. Sem
 * nenhuma transformação aplicada.
 * @param {string} color: A cor do mesh
 * @returns O mesh
 */
function buildBodyRect(color = "red") {
  const geometry = new BoxGeometry(2, 1.5, 7);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  return mesh;
}


/**
 * Constrói a cabine da nave. Possui a geometria de um cubo. Transformações
 * aplicadas: Shear e Escala.
 * @param {string} color : A cor do mesh. Por defeito é amarela;
 * @returns O mesh da cabine
 */
function buildCockpit(color = "yellow") {
  const geometry = new BoxGeometry(1.8, 1.4, 2);
  const shearMatrix = buildShearTransformation({ syz: -1 });
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  mesh.geometry.applyMatrix4(shearMatrix);
  mesh.scale.set(1, 1, 3.5);
  return mesh;
}

/**
 * Constrói uma asa da nave. Possui a geometria de um cone. Transformações
 * aplicadas: Escala e Translação
 * @param {boolean} isLeft Refere-se se é a asa esquerda caso seja true.
 * Caso contrário é direita. Por defeito é true;
 * @param {string} color A cor da asa. Por defeito é azul;
 * @returns O mesh da asa
 */
function buildWing(isLeft = true, color = "blue") {
  const geometry = new ConeGeometry(2.6, 10, 3);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  mesh.scale.set(0.8, 0.8, 0.2);
  mesh.position.set(isLeft ? -2.6 : 2.6, 0, 0.5);
  const zAngle = isLeft ? Math.degToRad(140) : Math.degToRad(220);
  mesh.rotation.set(Math.degToRad(-90), 0, zAngle);
  return mesh;
}

/**
 * Constrói um propulsor da nave. Possui a geometria de um cilindro.
 * Transformações aplicadas: Escala, Translação e rotação no eixo x.
 * @param {boolean} isLeft Refere-se se é o propulsor esquerdo caso seja true.
 * Caso contrário é direito. Por defeito é true;
 * @param {string} color A cor do propulsor. Por defeito é cinzento
 * @param {number} distanceToHull A distância do propulsor até o centro da
 * carcaça da nave
 * @returns O mesh do propulsor
 */
function buildThruster(isLeft = true, color = "grey", distanceToHull = 0.8) {
  // Distante of the thruster to the hull
  let thrustersDistanceToMainBody = distanceToHull;
  thrustersDistanceToMainBody = !isLeft
    ? thrustersDistanceToMainBody * -1
    : thrustersDistanceToMainBody;
  const geometry = new CylinderGeometry(1, 1, 3, 20);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  mesh.scale.set(0.4, 0.8, 0.4);
  mesh.position.set(thrustersDistanceToMainBody, 0, -3);
  mesh.rotateX(Math.degToRad(-95));
  return mesh;
}

/**
 * Constrói uma arma da nave. Possui a geometria de um cilindro.
 * Transformações aplicadas: Rotação, Escala e Translação
 * @param {"top" | "left" | "right"} position : A posição da arma na nave.
 * Apenas são aceites três posições;
 * @param {string} color: A cor da arma. Por defeito é verde
 * @returns O mesh da arma
 */
function buildWeapon(position, color = "green") {
  const geometry = new CylinderGeometry(0.2, 0.6, 5, 20);
  const material = new MeshBasicMaterial({ color });
  const mesh = new Mesh(geometry, material);
  switch (position) {
    case "top":
      mesh.rotateX(Math.degToRad(75));
      mesh.position.set(0, 0.8, 2.1);
      break;
    case "left":
      mesh.scale.set(0.2, 0.6, 0.2);
      mesh.rotateX(Math.degToRad(90));
      mesh.position.set(3.6, 0, 3);
      break;
    case "right":
      mesh.scale.set(0.2, 0.6, 0.2);
      mesh.rotateX(Math.degToRad(90));
      mesh.position.set(-3.6, 0, 3);
      break;

    default:
      throw new Error(
        "Posição da arma inválida. Tem de ser 'top', 'right' ou 'left'"
      );
  }
  return mesh;
}

/**
 * Constrói a transformação tensão de cisalhamento para ser aplicada em
 * objetos 3D. Desloca cada ponto em uma direção fixada.
 * @param {object} Pontos
 * @returns A matriz de transformação
 */
function buildShearTransformation({
  sxy = 0,
  sxz = 0,
  syx = 0,
  syz = 0,
  szx = 0,
  szy = 0,
}) {
  const shearMatrix = new Matrix4();
  shearMatrix.set(1, syx, szx, 0, sxy, 1, szy, 0, sxz, syz, 1, 0, 0, 0, 0, 1);
  return shearMatrix;
}

/**
 * Define a direção da bala
 * @param {Vector3} targerVector
 * @returns void
 */
function getShootDir(targetVec) {
  var vector = targetVec; // is te type vector 3
  targetVec.set(0, 0, 1);
  vector.unproject(camera);
  var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize());
  targetVec.copy(ray.direction);
}




export default PlayerShip;
