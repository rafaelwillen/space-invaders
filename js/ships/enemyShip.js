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
  constructor(ringColor = "#fafafa", sphereColor = "#f00") {
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
    this.shipObject.userData = {
      speed: 0.1,
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
    /**
     * @type {Vector3}
     */
    const position = this.shipObject.position;
    this.setDestination(destination);

    // Translate
    const posX = this.shipObject.position.x;
    const posZ = this.shipObject.position.z;
    const newPosX = destination.x;
    const newPosZ = destination.z;

    const multiplierX = posX > newPosX ? -1 : 1;
    const multiplierZ = posZ > newPosZ ? -1 : 1;

    // Calculate distance
    const differenceX = Math.abs(posX - newPosX);
    const differenceZ = Math.abs(posZ - newPosZ);
    const distance = Math.sqrt(
      differenceX * differenceX + differenceZ * differenceZ
    );

    this.shipObject.position.x =
      posX + speed * (differenceX / distance) * multiplierX;
    this.shipObject.position.z =
      posZ + speed * (differenceZ / distance) * multiplierZ;

    const strangeConstant = 3.5;

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

    if (moveCompleteOnX && moveCompleteOnY) {
      this.shipObject.position.set(
        Math.floor(this.shipObject.position.x),
        this.shipObject.position.y,
        Math.floor(this.shipObject.position.z)
      );
      this.setIsMoving(false);
      return;
    }
  }

  isMoving() {
    return this.shipObject.userData.isMoving;
  }

  setIsMoving(value) {
    this.shipObject.userData.isMoving = value;
  }

  setDestination({ x, z }) {
    this.shipObject.userData.destination = { x, z };
  }

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
