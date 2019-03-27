export function horizontalMirror(imgBuffer) {
  const { width, height } = imgBuffer;
  const result = imgBuffer.new({ width, height });

  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; ++i) {
      const mirrorJ = height - (j + 1);
      const pixel = imgBuffer.getPixel(i, mirrorJ).clone();
      result.setPixel(i, j, pixel);
    }
  }

  return result;
}

export function verticalMirror(imgBuffer) {
  const { width, height } = imgBuffer;
  const result = imgBuffer.new({ width, height });

  for (let j = 0; j < height; ++j) {
    for (let i = 0; i < width; ++i) {
      const mirrorI = width - (i + 1);
      const pixel = imgBuffer.getPixel(mirrorI, j).clone();
      result.setPixel(i, j, pixel);
    }
  }

  return result;
}
