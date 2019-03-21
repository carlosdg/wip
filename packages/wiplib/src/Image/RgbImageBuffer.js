import Pixel from "./Pixel";
import ImageBuffer from "./ImageBuffer";

/**
 * ImageBuffer class that treat Pixel objects as RGB pixels
 */
export default class RgbImageBuffer extends ImageBuffer {
  /**
   * @see {@link ImageBuffer#fromImageData}
   */
  static fromImageData({ width, height, data }) {
    return new RgbImageBuffer(width, height, data);
  }

  /**
   * @see {@link ImageBuffer#from}
   */
  static from(width, height, rawRgbaArray) {
    return new RgbImageBuffer(width, height, rawRgbaArray);
  }

  /**
   * @see {@link ImageBuffer#ofSize}
   */
  static ofSize(width, height) {
    return new RgbImageBuffer(width, height);
  }

  /**
   * @see {@link ImageBuffer#copyFrom}
   */
  static copyFrom(rgbImageBufferToCopy) {
    return new RgbImageBuffer(rgbImageBufferToCopy);
  }

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

  /**
   * @see {@link ImageBuffer#clone}
   */
  clone() {
    return RgbImageBuffer.copyFrom(this);
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
