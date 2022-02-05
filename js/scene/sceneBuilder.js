import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Scene,
  WebGLRenderer,
  Group,
  DoubleSide,
  BoxGeometry,
  Math,
  MeshLambertMaterial,
  LatheBufferGeometry,
} from "../library/three.module.js";

class SceneBuilder {
  /**
   * Cria o cenário com o piso e 4 paredes
   * @param {number} width : O comprimento do cenário;
   * @param {number} height: A largura do cenário;
   * @param {string} floorColor: A cor do piso. Por defeito é cinza
   * @param {string} wallColor: A cor da parede. Por defeito é cinza escuro
   * @returns {Group} O cenário
   */
  static createScenario(width = 100, height = 50, floorColor, wallColor) {
    const scenario = new Group();
    const floor = buildFloor(width, height, floorColor);
    const floorDimensions = floor.geometry.parameters;
    const rightWall = buildWall("right", height, 5, floorDimensions, wallColor);
    const leftWall = buildWall("left", height, 5, floorDimensions, wallColor);
    const backWall = buildWall("back", width, 5, floorDimensions, wallColor);
    const frontWall = buildWall("front", width, 5, floorDimensions, wallColor);
    scenario.add(floor, rightWall, leftWall, backWall, frontWall);
    return scenario;
  }

  static createEssentials() {
    const scene = new Scene();
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    return { scene, renderer };
  }
}

/**
 * Cria o piso do cenário
 * @param {number} width: O comprimento do piso ;
 * @param {number} height: A largura do piso ;
 * @param {string} color: A cor do piso. Por defeito é cinza
 * @returns {mesh} O mesh do piso
 */
function buildFloor(width, height, color = "#bbb") {
  const geometry = new PlaneGeometry(width, height);
  const material = new MeshLambertMaterial({
    color,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = Math.degToRad(-90);
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Cria uma parede para o cenário
 * @param {"right" | "left" | "back" | "front"} position : Qual lado da parede;
 * @param {number} width: A largura da parede
 * @param {number} height: A altura da parede
 * @param {{width: number, height:number}} floorSize: O tamanho do piso. Usado para determinar a
 * posição certa da parede
 * @param {string} color: A cor da parede. Por defeito é cinza
 * @returns {Mesh} O mesh da parede
 */
function buildWall(position, width, height, floorSize, color = "grey") {
  if (!["right", "left", "back", "front"].includes(position)) {
    throw new Error(
      "Posição da parede inválida. Tem que ser 'right','left', 'back' ou 'front'"
    );
  }
  // A espessura da parede
  const WALL_DEPTH = 0.5;
  let wall;
  let mesh;
  const material = new MeshLambertMaterial({ color });
  switch (position) {
    case "back":
      wall = new BoxGeometry(width, height, WALL_DEPTH);
      mesh = new Mesh(wall, material);
      mesh.position.y = 2.5;
      mesh.position.z = floorSize.height / 2;
      break;
    case "right":
      wall = new BoxGeometry(WALL_DEPTH, height, width);
      mesh = new Mesh(wall, material);
      mesh.position.y = 2.5;
      mesh.position.x = floorSize.width / 2;
      break;
    case "left":
      wall = new BoxGeometry(WALL_DEPTH, height, width);
      mesh = new Mesh(wall, material);
      mesh.position.y = 2.5;
      mesh.position.x = floorSize.width / -2;
      break;
    case "front":
      wall = new BoxGeometry(width, height, WALL_DEPTH);
      mesh = new Mesh(wall, material);
      mesh.position.y = 2.5;
      mesh.position.z = floorSize.height / -2;
      break;
  }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = `${position}Wall`;
  return mesh;
}
export default SceneBuilder;
