import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Object3D } from "three";

class EnemyShip {
  constructor() {
    this.ship = new Group();
    this.basicShape = this.buildBasicShape();
    this.ship.add(this.basicShape);
  }

  buildBasicShape() {
    const geometry = new BoxGeometry(10, 10, 10);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new Mesh(geometry, material);
    return mesh;
  }

  move(direction) {
    switch (direction) {
      case "left":
        console.log("Move Left");
        break;
      case "right":
        console.log("Move right");
        break;
    }
  }
}

export { EnemyShip };
