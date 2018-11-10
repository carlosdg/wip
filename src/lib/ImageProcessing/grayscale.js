import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns the values of the grayscale pixels of the image.
 * The method works even though the image is not in grayscale.
 */
export const getGrayscaleValues = rgbaImage => {
  
  let grayscaleValues = convertToGrayscale(rgbaImage.pixels);
  for (let i = 0; i < rgbaImage.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    grayscaleValues.push(rgbaImage.pixels[i]);
  }
  return grayscaleValues;
};

/**
 * Returns the given pixels converted to grayscale,
 * according to Phase Alternating Line (PAL). We assume
 * that the given pixels are in RGBA.
 *
 * @param {Array} pixels Pixels to convert
 * @returns {Array} Pixels values of the image, an element
 * for each pixel dimension (1 in case of grayscale)
 */
export const convertToGrayscale = pixels => {

  let convertedPixels = [];
  for (let i = 0; i < pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let rComponent = pixels[i],
      gComponent = pixels[i + 1],
      bComponent = pixels[i + 2];
    convertedPixels.push(
      Math.round(rComponent * 0.222 + gComponent * 0.707 + bComponent * 0.071)
    );
  }

  return convertedPixels;
};

/**
 * Checks if the given image (array of pixels) is in grayscale.
 *
 * @param {Array} pixels Pixels to check
 * @returns {Boolean} Result of the comprobation
 */
export const isInGrayscale = pixels => {

  for (let i = 0; i < pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let rComponent = pixels[i],
      gComponent = pixels[i + 1],
      bComponent = pixels[i + 2];

    if (rComponent !== gComponent || gComponent !== bComponent) return false;
  }
  return true;
};
