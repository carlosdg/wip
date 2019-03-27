import Pixel from "./Pixel";
import ImageBuffer from "./ImageBuffer";

/**
 * ImageBuffer class that treat Pixel objects as grayscale pixels
 */
export default class GrayscaleImageBuffer extends ImageBuffer {
  /**
   * @see {@link ImageBuffer#_encodePixel}
   */
  _encodePixel([r, g, b, transparency]) {
    const grayValue = pixelToGrayscalePal(r, g, b);
    return new Pixel([grayValue], transparency);
  }

  /**
   * @see {@link ImageBuffer#_decodePixel}
   */
  _decodePixel(pixel) {
    const grayValue = pixel.values[0];
    return [grayValue, grayValue, grayValue, pixel.transparency];
  }

  get pixelDimensions() {
    return 1;
  }

  /**
   * @see {@link ImageBuffer#maxPixelValues}
   */
  get maxPixelValues() {
    return [255];
  }

  /**
   * @see {@link ImageBuffer#minPixelValues}
   */
  get minPixelValues() {
    return [0];
  }
}

/** Returns the given pixel to grayscale according to Phase Alternating Line */
function pixelToGrayscalePal(r, g, b) {
  return Math.round(r * 0.222 + g * 0.707 + b * 0.071);
}
