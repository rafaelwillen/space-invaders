class PlayerShip {
  speedPlayer = 0.56;
  create3DObject(x = 1, y = 1, z = 1) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color: "#0000ff" });
    const cube = new THREE.Mesh(geometry, material);
    return cube;
  }

  movePlayer(player, threshold) {
    addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          if (player.position.x >= threshold * -1)
            player.position.x -= this.speedPlayer;
          break;
        case "ArrowRight":
          if (player.position.x <= threshold)
            player.position.x += this.speedPlayer;
          break;
      }
    });
  }
}
