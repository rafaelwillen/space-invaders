class PlayerShip {
  speedPlayer = 0.56;
  create3DObject(x = 1, y = 1, z = 1) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color: "#0000ff" });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  movePlayer(player) {
    addEventListener("keydown", (event) => {
      // if (event.key == "ArrowUp") player.position.z -= this.speedPlayer;
      // else if (event.key == "ArrowDown") player.position.z += this.speedPlayer;
      if (event.key == "ArrowLeft") player.position.x -= this.speedPlayer;
      else if (event.key == "ArrowRight") player.position.x += this.speedPlayer;
    });
  }
}
