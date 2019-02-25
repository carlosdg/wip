import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns an image buffer of the given region of the given buffer
 *
 * @param {RgbaImageBuffer} imgBuffer Buffer of the image to crop
 * @param {Object} region Region specifying where to crop the given buffer
 * @param {number} region.top Pixel in the y axis where the new image must start
 * @param {number} region.left Pixel in the x axis where the new image must
 * start
 * @param {number} region.height Height of the new image
 * @param {number} region.width Width of the new image
 */
export const crop = (
  imgBuffer,
  { top = 0, left = 0, height = imgBuffer.height, width = imgBuffer.width } = {}
) => {
  const resultPixels = new Uint8ClampedArray(
    height * width * RgbaImageBuffer.NUM_CHANNELS
  );
  let currentIndex = 0;

  for (let yOffset = 0; yOffset < height; yOffset += 1) {
    for (let xOffset = 0; xOffset < width; xOffset += 1) {
      const pixel = imgBuffer.getPixel({ x: left + xOffset, y: top + yOffset });
      resultPixels[currentIndex] = pixel[0];
      resultPixels[currentIndex + 1] = pixel[1];
      resultPixels[currentIndex + 2] = pixel[2];
      resultPixels[currentIndex + 3] = pixel[3];
      currentIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }

  return new RgbaImageBuffer(width, height, resultPixels);
};
