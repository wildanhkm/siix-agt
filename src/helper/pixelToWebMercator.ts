
const pixelToWebMercator = (
  pixelX: number,
  pixelY: number,
  originX: number,
  originY: number,
  pixelScale: number
): number[] => {
  let mercatorX = originX + pixelX * pixelScale;
  let mercatorY = originY - pixelY * pixelScale;
  return [mercatorX, mercatorY];
};

export default pixelToWebMercator