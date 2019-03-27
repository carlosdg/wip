import Pixel from "./Pixel";
import ImageBuffer from "./ImageBuffer";

/**
 * ImageBuffer class that treat Pixel objects as RGB pixels
 */
export default class RgbImageBuffer extends ImageBuffer {
  /**
   * @see {@link ImageBuffer#_encodePixel}
   */
  _encodePixel([r, g, b, transparency]) {
    return new Pixel([r, g, b], transparency);
  }

  /**
   * @see {@link ImageBuffer#_decodePixel}
   */
  _decodePixel(pixel) {
    return [...pixel.values, pixel.transparency];
  }

  get pixelDimensions() {
    return 3;
  }

  /**
   * @see {@link ImageBuffer#maxPixelValues}
   */
  get maxPixelValues() {
    return [255, 255, 255];
  }

  /**
   * @see {@link ImageBuffer#minPixelValues}
   */
  get minPixelValues() {
    return [0, 0, 0];
  }
}
