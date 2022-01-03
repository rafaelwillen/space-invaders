import { DirectionalLight } from "../library/three.module.js";

class LightBuilder {
  static buildDirectionalLight() {
    const horizontalAxis = 100;
    const verticalAxis = 40;
    const near = 1;
    const far = 500;
    const lightSource = new DirectionalLight("#fff", 0.5);
    lightSource.castShadow = true;
    lightSource.shadow.camera.near = near;
    lightSource.shadow.camera.far = far;
    lightSource.shadow.camera.left = -horizontalAxis;
    lightSource.shadow.camera.right = horizontalAxis;
    lightSource.shadow.camera.top = verticalAxis;
    lightSource.shadow.camera.bottom = -verticalAxis;
    lightSource.translateY(30);
    return lightSource;
  }
}

export default LightBuilder;
