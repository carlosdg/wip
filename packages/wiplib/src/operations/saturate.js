import RgbaImageBuffer from "../RgbaImageBuffer";
import * as colorSpaceConversions from "../colorSpaceConversions";

/**
 * Saturates the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image Buffer base
 * @param {Number} saturationPercentage Saturation percentage for the operation
 * @returns {RgbaImageBuffer} Converted image
 */
export const saturateImage = (imgBuffer, saturationPercentage) => {
  const result = imgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    const rComponent = imgBuffer.pixels[i];
    const gComponent = imgBuffer.pixels[i + 1];
    const bComponent = imgBuffer.pixels[i + 2];

    const HSLPixel = colorSpaceConversions.RGBToHSL({
      r: rComponent,
      g: gComponent,
      b: bComponent
    });
    const newRGBPixel = colorSpaceConversions.HSLToRGB({
      h: HSLPixel.h,
      s: HSLPixel.s * saturationPercentage / 100,
      l: HSLPixel.l
    });

    result.pixels[i] = newRGBPixel.r;
    result.pixels[i + 1] = newRGBPixel.g;
    result.pixels[i + 2] = newRGBPixel.b;
  }

  return result;
};
