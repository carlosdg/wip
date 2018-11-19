import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Transforms an image according to the given lookup table.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Array} lookupTable Lookup table
 * @returns {RgbaImageBuffer} Transformed image
 */
export const transformImage = (imgBuffer, lookupTable) => {
  let result = imgBuffer.copy();
  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let newValue = lookupTable[result.pixels[i]];
    result.pixels[i] = newValue;
    result.pixels[i + 1] = newValue;
    result.pixels[i + 2] = newValue;
  }

  return result;
};

/** Returns an RgbaImageBuffer from the transformed region */
export const transformImageRegion = (
  imgBuffer,
  lookupTable,
  { top = 0, left = 0, height = imgBuffer.height, width = imgBuffer.width } = {}
) => {
  const resultPixels = new Uint8ClampedArray(
    height * width * RgbaImageBuffer.NUM_CHANNELS
  );
  let resultIndex = 0;

  for (let y = top; y < height; y += 1) {
    for (let x = left; x < width; x += 1) {
      const newValue = lookupTable[imgBuffer.getPixel({ x, y })[0]];
      resultPixels[resultIndex] = newValue;
      resultPixels[resultIndex + 1] = newValue;
      resultPixels[resultIndex + 2] = newValue;
      resultPixels[resultIndex + 3] = 255;
      resultIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }

  return new RgbaImageBuffer(width, height, resultPixels);
};
