import {
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Vector3,
} from "../library/three.module.js";

class Bullet extends Mesh {
  constructor() {
    this.velocity = new Vector3();
    this.alive = true;
    this.shoot = 0;
    const geometry = new SphereGeometry(2.1, 8.8);
    const material = new MeshBasicMaterial({ color: "#f00" });
    super(geometry, material);
  }
}

export default Bullet;
