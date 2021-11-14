import {
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  Scene,
  WebGLRenderer,
} from "../library/three.module.js";

class SceneBuilder {
  static createFloor(width = 40, height = 40) {
    const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({
      color: 0xbbbbbb,
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI * -0.5;
    return mesh;
  }

  static createEssentials() {
    const scene = new Scene();
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
    return { scene, renderer };
  }
}

export default SceneBuilder;
