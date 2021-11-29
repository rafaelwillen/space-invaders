import { Vector3 } from "../library/three.module.js";

/**
 * Gera de forma aleatória um novo ponto para a movimentação da nave inimiga
 * @returns {Vector3}
 */
export function generateRandomPosition() {
  const scalar = Math.random() * 20 + 10;
  const newDestination = new Vector3().randomDirection().multiplyScalar(scalar);
  newDestination.y = 1.5;
  return newDestination;
}
