export default CameraControls = {
  /**
   * Faz com que uma camera perspetiva gire em torno da cena
   * @param {PerspectiveCamera} camera A camera
   * @param {Vector3} scenePosition A posição da cena
   */
  rotateAroundScene(camera, scenePosition) {
    // Velocidade de rotação
    const rotationSpeed = 0.01;
    const { x, z } = camera.position;
    camera.position.x =
      x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
    camera.position.z =
      z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed);
    camera.lookAt(scenePosition);
  },
  /**
   * Faz com que uma camera perspetiva siga um objeto. Similar a camera de
   * terceira pessoa.
   * @param {PerspectiveCamera} camera A camera
   * @param {Object3D} object O objeto a ser seguido
   * @param {number} distanceToObject A distância do objeto até a camera. Não pode ser negativa
   */
  followObject(camera, object, distanceToObject) {
    const { x, y, z } = object.position;
    if (distanceToObject < 0)
      throw new Error("Distância não pode ser negativa");
    camera.position.set(x, y, z + distanceToObject);
    camera.lookAt(object.position);
  },
};
