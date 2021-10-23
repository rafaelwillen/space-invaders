class CameraBuilder {
  static buildPerspectiveCamera({ x = 0, y = 0, z = 0, name = "camera" }) {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    camera.name = name;
    camera.position.set(x, y, z);
    return camera;
  }
}
