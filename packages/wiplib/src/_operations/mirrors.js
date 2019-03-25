export function horizontalMirror(imgBuffer) {
  const { width, height } = imgBuffer;
  const result = imgBuffer.clone();

  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; ++i) {
      const mirrorJ = height - (j + 1);
      const pixel = imgBuffer.getPixel(i, mirrorJ);
      result.setPixel(i, j, pixel);
    }
  }

  return result;
}

export function verticalMirror(imgBuffer) {
  const { width, height } = imgBuffer;
  const result = imgBuffer.clone();

  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; ++i) {
      const mirrorI = width - (i + 1);
      const pixel = imgBuffer.getPixel(mirrorI, j);
      result.setPixel(i, j, pixel);
    }
  }

  return result;
}
