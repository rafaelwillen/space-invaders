import {
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
} from "../library/three.module.js";

class PlayerShip {
  speedPlayer = 0.56;
  create3DObject(x = 1, y = 1, z = 1) {
    const geometry = new BoxGeometry(x, y, z);
    const material = new MeshBasicMaterial({ color: "#0000ff" });
    const cube = new Mesh(geometry, material);
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

export default PlayerShip;
