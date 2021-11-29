import {
  Group,
  MeshBasicMaterial,
  Mesh,
  TorusGeometry,
  SphereGeometry,
  CylinderGeometry,
  Vector3,
} from "../library/three.module.js";

class EnemyShip {
  /**
   *
   * @param {string} ringColor A cor do anel
   * @param {string} sphereColor A cor da esfera
   * @param {number} speed A velocidade da nave
   * @param {{x:number, y:number, z:number}} position A posição da nave
   */
  constructor(
    ringColor = "#fafafa",
    sphereColor = "#f00",
    speed = 0.1,
    position = { x: 0, y: 1.5, z: 0 }
  ) {
    // Cria um grupo para juntar várias partes da nave
    this.shipObject = new Group();
    const ring = buildRing(ringColor);
    const sphere = buildSphere(sphereColor);
    const turret = buildTurret();
    const barrel = buildBarrel();

    turret.add(barrel);
    this.shipObject.add(sphere, ring, turret);

    // Transformações da nave
    const scaleFactor = 0.2;
    // Gira a nave -90º
    this.shipObject.rotateX(-Math.PI / 2);
    // Gira a nave -180º
    this.shipObject.rotateZ(-Math.PI);
    this.shipObject.scale.set(scaleFactor, scaleFactor, scaleFactor);
    position.y = position.y ? position.y : 1.5;
    this.shipObject.position.set(position.x, position.y, position.z);
    this.shipObject.userData = {
      speed,
      isMoving: false,
      destination: {
        x: 0,
        z: 0,
      },
    };
  }

  /**
   * Movimenta a nave para um ponto
   * @param {Vector3} destination O ponto
   */
  move(destination) {
    const { speed } = this.shipObject.userData;
    // Define a posição de destino da nave inimiga
    this.setDestination(destination);

    const posX = this.shipObject.position.x;
    const posZ = this.shipObject.position.z;
    const newPosX = destination.x;
    const newPosZ = destination.z;

    // Utiliza os multiplicadores caso sejam necessários valores negativos
    const multiplierX = posX > newPosX ? -1 : 1;
    const multiplierZ = posZ > newPosZ ? -1 : 1;

    /* 
      Calcula a distância da posição inicial da nave para o destino com o
      Teorema de Pitágoras
    */
    const differenceX = Math.abs(posX - newPosX);
    const differenceZ = Math.abs(posZ - newPosZ);
    const distance = Math.sqrt(
      differenceX * differenceX + differenceZ * differenceZ
    );

    // Define a nova posição da nave
    this.shipObject.position.x =
      posX + speed * (differenceX / distance) * multiplierX;
    this.shipObject.position.z =
      posZ + speed * (differenceZ / distance) * multiplierZ;

    const strangeConstant = 1.5;

    const moveCompleteOnX =
      Math.floor(this.shipObject.position.x) <=
        Math.floor(newPosX) + strangeConstant &&
      Math.floor(this.shipObject.position.x) >=
        Math.floor(newPosX) - strangeConstant;
    const moveCompleteOnY =
      Math.floor(this.shipObject.position.z) <=
        Math.floor(newPosZ) + strangeConstant &&
      Math.floor(this.shipObject.position.z) >=
        Math.floor(newPosZ) - strangeConstant;

    /**
     * Se a movimentação estiver completa, arredonda o valor aproximado da
     * nova posição e define a nave para parar de se mover
     */
    if (moveCompleteOnX && moveCompleteOnY) {
      this.shipObject.position.set(
        Math.floor(this.shipObject.position.x),
        this.shipObject.position.y,
        Math.floor(this.shipObject.position.z)
      );
      this.setIsMoving(false);
    }
  }

  /**
   * Verifica se a nave está a se mexer ou não
   * @returns {boolean}
   */
  isMoving() {
    return this.shipObject.userData.isMoving;
  }

  /**
   * Define se a nave está a se mover ou não
   * @param {boolean} value
   */
  setIsMoving(value) {
    this.shipObject.userData.isMoving = value;
  }

  /**
   * Define um novo destino da nave
   * @param {{x: number, y:number}} position A nova posição
   */
  setDestination({ x, z }) {
    this.shipObject.userData.destination = { x, z };
  }

  /**
   * Retorna o destino da nave
   * @returns {{x:number, y:number}}
   */
  getDestination() {
    const { x, z } = this.shipObject.userData.destination;
    return { x, z };
  }
}

/**
 * Constrói o anel da nave
 * @param {string} color: A cor do anel. Por padrão é um cinza muito claro
 * @returns {Mesh} O mesh do anel
 */
function buildRing(color = "#fafafa") {
  const ringScale = 0.9;
  const ringGeometry = new TorusGeometry(10, 2, 3, 50);
  const ringMaterial = new MeshBasicMaterial({ color });
  const ring = new Mesh(ringGeometry, ringMaterial);
  ring.scale.set(ringScale, ringScale, ringScale);
  return ring;
}

/**
 *  Constrói a esfera da nave
 *  @param {string} color: A cor da esfera. Por padrão é vermelha
 * @returns {Mesh} O mesh da esfera
 */
function buildSphere(color = "#f00") {
  const sphereGeometry = new SphereGeometry(8);
  const sphereMaterial = new MeshBasicMaterial({ color });
  const sphere = new Mesh(sphereGeometry, sphereMaterial);
  sphere.scale.set(1, 1, 0.5);
  return sphere;
}

/**
 * Constrói a base da arma
 * @param {string} color :A cor da base. Por padrão é cinza ;
 * @returns {Mesh} O mesh da base
 */
function buildTurret(color = "#888") {
  const turretGeometry = new SphereGeometry(2.4);
  const turretMaterial = new MeshBasicMaterial({ color });
  const turret = new Mesh(turretGeometry, turretMaterial);
  turret.translateZ(-3);
  return turret;
}

/**
 * Constrói o cano da arma. Deve ser agrupado com a base da arma
 * @param {string} color : A cor do cano da arma. Por padrão é amarela
 * @returns {Mesh} O mesh do cano da arma
 */
function buildBarrel(color = "#ff0") {
  const scaleFactor = 0.1;
  const barrelGeometry = new CylinderGeometry(3, 6, 60, 60, 1);
  const barrelMaterial = new MeshBasicMaterial({ color });
  const barrel = new Mesh(barrelGeometry, barrelMaterial);
  barrel.translateY(-2.1);
  barrel.translateZ(-1.6);
  // Gira o cano da arma -180º
  barrel.rotateZ(-Math.PI);
  barrel.scale.set(scaleFactor, scaleFactor, scaleFactor);
  return barrel;
}
export default EnemyShip;
