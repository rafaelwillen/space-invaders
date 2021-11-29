/**
 * Gera uma cor aleatória
 * @returns {string}
 */
export function getRandomColor() {
  const randomColor = (Math.random() * 16777215).toString("16").split(".")[0];
  console.log(randomColor);
  return `#${randomColor}`;
}
