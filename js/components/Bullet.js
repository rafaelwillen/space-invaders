import {
  Mesh,
  MeshPhongMaterial,
  SphereGeometry,
} from "../library/three.module.js";

export default class Bullet extends Mesh {
  constructor(radio, widthSeq, heightSeq) {
    super();
    const geometry = new SphereGeometry(radio, widthSeq, heightSeq);
    const material = new MeshPhongMaterial({ color: "#ff000f" });
    const bullet = new Mesh(geometry, material);
    bullet.scale.set(0.5, 0.5, 0.5);
    this.alive = true;
    this.velocity;
    bullet.castShadow = true;
    bullet.receiveShadow = true;
    return bullet;
  }
}
