import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Applies horizontal mirror operation to the given image.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @returns {RgbaImageBuffer} Transformed image
 */
const horizontalMirror = imgBuffer => {
  const width = imgBuffer.width;
  const height = imgBuffer.height;
  const resultPixels = new Uint8ClampedArray(
    width * height * RgbaImageBuffer.NUM_CHANNELS
  );
  let currentIndex = 0;
  let originalImagePixel;
  for (let j = height - 1; j >= 0; --j) {
    for (let i = 0; i < width; ++i) {
      originalImagePixel = imgBuffer.getPixel({ x: i, y: j });
      resultPixels[currentIndex] = originalImagePixel[0]; // R channel
      resultPixels[currentIndex + 1] = originalImagePixel[1]; // G channel
      resultPixels[currentIndex + 2] = originalImagePixel[2]; // B channel
      resultPixels[currentIndex + 3] = originalImagePixel[3]; // A channel
      currentIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }

  return new RgbaImageBuffer(width, height, resultPixels);
};

/**
 * Applies vertical mirror operation to the given image.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @returns {RgbaImageBuffer} Transformed image
 */
const verticalMirror = imgBuffer => {
  const width = imgBuffer.width;
  const height = imgBuffer.height;
  const resultPixels = new Uint8ClampedArray(
    width * height * RgbaImageBuffer.NUM_CHANNELS
  );
  let currentIndex = 0;
  let originalImagePixel;
  for (let j = 0; j < height; ++j) {
    for (let i = width - 1; i >= 0; --i) {
      originalImagePixel = imgBuffer.getPixel({ x: i, y: j });
      resultPixels[currentIndex] = originalImagePixel[0]; // R channel
      resultPixels[currentIndex + 1] = originalImagePixel[1]; // G channel
      resultPixels[currentIndex + 2] = originalImagePixel[2]; // B channel
      resultPixels[currentIndex + 3] = originalImagePixel[3]; // A channel
      currentIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }

  return new RgbaImageBuffer(width, height, resultPixels);
};

export const mirror = {
  horizontal: horizontalMirror,
  vertical: verticalMirror
};
