class EnemyShip {
  constructor() {
    this.step = 0;
    // Cria um grupo para juntar várias partes da nave
    this.shipObject = new THREE.Group();
    this.shipObject.name = "nave-inimiga";
    // Cria uma simples caixa verde 10x10x10
    const basicBox = this.buildBasicBox();
    this.shipObject.add(basicBox);
  }

  buildBasicBox() {
    const geometry = new THREE.BoxGeometry(2, 1, 3);
    // Cor verde
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  move(threshold) {
    this.step += 0.02;
    this.shipObject.position.x = (threshold + 1) * Math.sin(this.step);
  }
}
