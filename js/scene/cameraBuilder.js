import {
  OrthographicCamera,
  PerspectiveCamera,
} from "../library/three.module.js";

class CameraBuilder {
  static buildPerspectiveCamera({
    x = 0,
    y = 0,
    z = 0,
    name = "camera",
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
  }) {
    const camera = new PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.name = name;
    camera.position.set(x, y, z);
    camera.rotation.set(rotationX, rotationY, rotationZ);
    return camera;
  }

  static buildOrthographicCamera({
    x = 0,
    y = 0,
    z = 0,
    name = "camera",
    rotationX = 0,
    rotationY = 0,
    rotationZ = 0,
  }) {
    const horizontalAxis = 55;
    const verticalAxis = 20;
    const near = 1;
    const far = 500;
    const camera = new OrthographicCamera(
      -horizontalAxis,
      horizontalAxis,
      verticalAxis,
      -verticalAxis,
      near,
      far
    );
    camera.name = name;
    camera.position.set(x, y, z);
    camera.rotation.set(rotationX, rotationY, rotationZ);
    return camera;
  }
}

export default CameraBuilder;
