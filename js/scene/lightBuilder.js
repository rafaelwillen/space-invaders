import {
  DirectionalLight,
  MathUtils,
  PointLight,
  SpotLight,
  Vector2,
  Vector3,
} from "../library/three.module.js";

const SHADOW_MAP_SIZE = Math.pow(2, 10);

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
    lightSource.shadow.mapSize = new Vector2(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
    return lightSource;
  }

  /**
   *
   * @param {Vector3} position
   */
  static buildSpotLight(position) {
    const lightSource = new SpotLight("#fff");
    lightSource.position.copy(position);
    lightSource.castShadow = true;
    lightSource.shadow.mapSize = new Vector2(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
    lightSource.shadow.camera.near = 1;
    lightSource.shadow.camera.far = 500;
    lightSource.shadow.camera.fov = 45;
    // lightSource.distance = 40;
    lightSource.angle = MathUtils.degToRad(30);
    return lightSource;
  }

  /**
   *
   * @param {Vector3} position
   */
  static buildPointLight(position) {
    const lightSource = new PointLight("#fff", 10, 180);
    lightSource.position.copy(position);
    lightSource.castShadow = true;
    lightSource.shadow.mapSize = new Vector2(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
    return lightSource;
  }
}

export default LightBuilder;
