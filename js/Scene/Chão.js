class SceneBuilder {
  static createFloor(width = 40, height = 40) {
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: 0xbbbbbb,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI * -0.5;
    return mesh;
  }

  static createEssentials() {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, innerHeight);
    document.body.appendChild(renderer.domElement);
    return { scene, renderer };
  }
}
