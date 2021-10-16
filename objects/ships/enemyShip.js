import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";

class EnemyShip {
  constructor() {
    // Cria um grupo para juntar várias partes da nave
    this.ship = new Group();
    this.ship.name = "nave-inimiga";
    // Cria uma simples caixa verde 10x10x10
    this.basicBox = this.buildBasicBox();
    this.ship.add(this.basicBox);
  }

  buildBasicBox() {
    const geometry = new BoxGeometry(10, 10, 10);
    // Cor verde
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new Mesh(geometry, material);
    return mesh;
  }

  move(direction, speed) {
    switch (direction) {
      case "left":
        this.ship.position.x -= speed;
        break;
      case "right":
        this.ship.position.x += speed;
        break;
    }
  }
}

export { EnemyShip };
