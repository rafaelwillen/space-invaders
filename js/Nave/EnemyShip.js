class EnemyShip {
  constructor() {
    this.speed = 0.2;
    // Cria um grupo para juntar várias partes da nave
    this.shipObject = new THREE.Group();
    this.shipObject.name = "nave-inimiga";
    // Cria uma simples caixa verde 10x10x10
    const basicBox = this.buildBasicBox();
    this.shipObject.add(basicBox);
    this.shipObject.userData.direction = "left";
  }

  buildBasicBox() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    // Cor verde
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  move(threshold) {
    const shipPositionX = this.shipObject.position.x;
    let newDirection = this.shipObject.userData.direction;
    // Se passar o threshold, a nave muda de direção
    if (shipPositionX >= threshold) newDirection = "left";
    else if (shipPositionX <= threshold * -1) newDirection = "right";
    switch (newDirection) {
      case "left":
        this.shipObject.position.x -= this.speed;
        break;
      case "right":
        this.shipObject.position.x += this.speed;
        break;
    }
    this.shipObject.userData.direction = newDirection;
  }
}

