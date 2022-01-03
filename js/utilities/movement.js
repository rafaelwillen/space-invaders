import { Vector3 } from "../library/three.module.js";

/**
 * Gera de forma aleatória um novo ponto para a movimentação da nave inimiga
 * @returns {Vector3}
 */
export function generateRandomPosition() {
  const scalarX = Math.random() * 100;
  const scalarZ = Math.random() * 10 + 20;
  const newDestination = new Vector3().randomDirection();
  newDestination.x *= scalarX;
  newDestination.z *= scalarZ;
  newDestination.y = 1.5;
  return newDestination;
}
