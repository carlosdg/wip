// TODO: pollyfill ImageData constructor
/**
 * Class to represent a RGBA pixel matrix (an image). This class aims to
 * abstract away the pixel related manipulations by providing a set of
 * convenience methods for iterating through pixels.
 */
export default class RgbaImageBuffer {
  /** Number of channels in a RGBA pixel */
  static NUM_CHANNELS = 4;

  /**
   * Convenient function to create a RgbaImage instance from an ImageData object
   * where the width, height are copied but the pixel array is only copied the
   * references
   *
   * @param {ImageData} imgData ImageData instance to create the RgbaImage from
   * @returns {RgbaImageBuffer} Instance of RgbaImage initialized from the ImgData
   */
  static fromImageData({ width, height, data }) {
    return new RgbaImageBuffer(width, height, data);
  }

  /**
   * Convenient function to create an ImageData object from a RgbaImage object
   *
   * @param {RgbaImageBuffer} rgbaImage Instance of RgbaImage used to create the
   * ImageData
   * @returns {ImageData} ImageData instance with a copy of the width, height
   * and pixels of the given RgbaImage
   */
  static toImageData({ width, height, pixels }) {
    const imgData = new ImageData(width, height);
    imgData.data.set(pixels);

    return imgData;
  }

  /**
   * Creates an instance of this class. Note: this treats the given pixels as
   * RGBA pixels
   *
   * @param {number} width Pixel matrix width
   * @param {number} height Pixel matrix height
   * @param {Uint8ClampedArray} pixels TypedArray of RGBA Pixels
   */
  constructor(width, height, pixels) {
    // TODO: check that everything is right (width, height > 0; width * height *
    // rgbaDimension = pixels.length; etc)
    this._width = width;
    this._height = height;
    this._pixels = pixels;
  }

  /** Alias for RgbaImage.toImageData(instanceOfRgbaImage) */
  toImageData = () => RgbaImageBuffer.toImageData(this);

  /** Returns a deep copy of this RgbaImage instance */
  copy = () =>
    new RgbaImageBuffer(
      this.width,
      this.height,
      new Uint8ClampedArray(this.pixels)
    );

  /**
   * Returns the pixel value at the given position
   *
   * @param {Object} coordinates Matrix coordinates of the pixel to get
   * @param {number} coordinates.x Horizontal coordinate
   * @param {number} coordinates.y Vertical coordinate
   * @returns {Array} Pixel value at the given coordinates (an array with one
   *  element per pixel dimension, 4 in case of RGBA for example)
   */
  getPixel = ({ x, y }) => {
    x = Math.max(0, Math.min(this.width - 1, x));
    y = Math.max(0, Math.min(this.height - 1, y));

    const pixelPosition = this._mapMatrixPositionToArray(x, y);

    // We tested this way and it turned to be much more performant than using slice
    return [
      this.pixels[pixelPosition],
      this.pixels[pixelPosition + 1],
      this.pixels[pixelPosition + 2],
      this.pixels[pixelPosition + 3]
    ];
  };

  /**
   * @returns {Uint8ClampedArray} Pixels values of the image, an element for
   * each pixel dimension (4 in case of RGBA for example)
   */
  get pixels() {
    return this._pixels;
  }

  /** @returns {number} The width of the image */
  get width() {
    return this._width;
  }

  /** @returns {number} The height of the image */
  get height() {
    return this._height;
  }

  /**
   * Given a coordinate in matrix space (2 dimensions) this method returns the
   * corresponding coordinate in vector space (1 dimension).
   *
   * @param {number} x Horizontal coordinate
   * @param {number} y Vertical coordinate
   * @returns {number} Corresponding vector coordinate
   */
  _mapMatrixPositionToArray = (x, y) =>
    (y * this.width + x) * RgbaImageBuffer.NUM_CHANNELS;
}
