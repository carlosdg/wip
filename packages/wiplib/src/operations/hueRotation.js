import RgbaImageBuffer from "../RgbaImageBuffer";
import * as colorSpaceConversions from "../colorSpaceConversions";

/**
 * Rotates the H channel of the image
 *
 * @param {RgbaImageBuffer} imgBuffer Image Buffer base to create the grayscale
 * image from
 * @param {Number} degrees Amount of degrees for the hue rotation
 * @returns {RgbaImageBuffer} Converted image
 */
export const hueRotation = (imgBuffer, degrees) => {
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
      h: (HSLPixel.h + degrees) % 360,
      s: HSLPixel.s,
      l: HSLPixel.l
    });

    result.pixels[i] = newRGBPixel.r;
    result.pixels[i + 1] = newRGBPixel.g;
    result.pixels[i + 2] = newRGBPixel.b;
  }

  return result;
};
