import Pixel from "./Pixel";

/**
 * ImageBuffer base class. This class define the shape of an ImageBuffer.
 * ImageBuffer classes must implement the following structure to be consistent.
 * Alternatively classes can inherit from this base class and just implement the
 * unimplemented methods.
 */
export default class ImageBuffer {
  /**
   * A convenient method to create an instance of ImageBuffer from an
   * ImageData object
   */
  static fromImageData({ width, height, data }) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * A semantic alternative to using the constructor with three values: the
   * width, height of the ImageBuffer to create. And the raw RGBA array of
   * values to create the object from
   */
  static from(width, height, rawRgbaArray) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * A semantic alternative to using the constructor with just two values: the
   * width and height of the blank ImageBuffer to create
   */
  static ofSize(width, height) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * A semantic alternative to using the constructor with just one value:
   * a ImageBuffer instance to copy
   */
  static copyFrom(imageBufferToCopy) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * Creates a instance of this class
   *
   * @param  {...any} args List of arguments, depending on the number of
   * arguments provided the new instance will be constructed one way or another:
   * 1. Copy constructor. The expected argument is the ImageBuffer to copy from
   * 2. Constructor for a blank image buffer. The expected arguments are the
   *    width and height of the new image buffer to create and it will be
   *    populated with transparent pixels
   * 3. Constructor from a raw RGBA array of values. The expected arguments are
   *    the width, height and the RGBA array
   */
  constructor(...args) {
    switch (args.length) {
      case 1:
        this._constructorForCopy(...args);
        break;
      case 2:
        this._constructorForBlank(...args);
        break;
      case 3:
        this._constructorForNewFromRawValues(...args);
        break;
      default:
        throw new Error("Invalid number of arguments");
    }
  }

  /**
   * Returns the image data object from this image buffer
   */
  toImageData() {
    const rgbaArray = [];

    for (const pixel of this._pixels) {
      const rgba = this._decodePixel(pixel);
      rgbaArray.push(...rgba);
    }

    const rgbaRawValues = new Uint8ClampedArray(rgbaArray);
    return new ImageData(rgbaRawValues, this.width, this.height);
  }

  /**
   * Returns a copy of this image buffer
   */
  clone() {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * Iterates over all pixels calling `callback` for each one passing the pixel
   * object and position as argument
   *
   * @param {function(Pixel, number, number)} callback Function run for each
   * pixel
   * @returns {ImageBuffer} This image buffer. This is to provide a fluid
   * interface
   */
  forEachPixel(callback) {
    for (let i = 0; i < this.width; ++i) {
      for (let j = 0; j < this.height; ++j) {
        const pixel = this.getPixel(i, j);
        callback(pixel, i, j);
      }
    }

    return this;
  }

  /**
   * Returns the pixel at the given row and column position
   */
  getPixel(row, col) {
    const arrayPos = this._mapMatrixPositionToArray(row, col);
    return this._pixels[arrayPos];
  }

  /**
   * Sets the given pixel to the position specified by the given row and column
   *
   * @returns {ImageBuffer} This image buffer. This is to provide a fluid
   * interface
   */
  setPixel(row, col, pixel) {
    const arrayPos = this._mapMatrixPositionToArray(row, col);
    this._pixels[arrayPos] = pixel;
    return this;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get pixelDimensions() {
    throw new Error("UNIMPLEMENTED");
  }

  get maxPixelValues() {
    throw new Error("UNIMPLEMENTED");
  }

  get minPixelValues() {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * Returns a Pixel object representing in RGB the given color in RGBA
   *
   * @param {number[]} rgbaValue An array with four elements representing the RGBA
   * values needed to create the Pixel object
   * @returns {Pixel} The Pixel object representing the given color
   */
  _encodePixel([r, g, b, transparency]) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * Inverse operation to `encodePixel`. This returns the raw RGBA representation
   * of the given Pixel object
   *
   * @param {Pixel} pixel The pixel to represent in raw RGBA
   * @returns {number[]} An array with four values representing the RGBA value
   */
  _decodePixel(pixel) {
    throw new Error("UNIMPLEMENTED");
  }

  /**
   * Given a coordinate in matrix space (2 dimensions) this method returns the
   * corresponding coordinate in vector space (1 dimension).
   *
   * @param {number} x Horizontal coordinate
   * @param {number} y Vertical coordinate
   * @returns {number} Corresponding vector coordinate
   */
  _mapMatrixPositionToArray(x, y) {
    return y * this.width + x;
  }

  /**
   * Initializes this instance by copying the given object
   */
  _constructorForCopy(imageBufferToCopy) {
    this._width = imageBufferToCopy.width;
    this._height = imageBufferToCopy.height;
    this._pixels = [];

    for (const pixel of imageBufferToCopy._pixels) {
      const clone = pixel.clone();
      this._pixels.push(clone);
    }
  }

  /**
   * Initializes this instance to be of the given width and height with the
   * pixels being transparent
   */
  _constructorForBlank(width, height) {
    this._width = width;
    this._height = height;
    this._pixels = [];
    const transparentPixelValue = [...this.minPixelValues, 0];

    for (let i = 0; i < this._width * this._height; ++i) {
      const pixel = this._encodePixel(transparentPixelValue);
      this._pixels.push(pixel);
    }
  }

  /**
   * Initializes this instance to be of the given width and height. And having
   * the pixels initialized with the values of the given raw RGBA pixels.
   *
   * @throws {Error} If the given raw RGBA values size cannot match the
   * requested dimension
   */
  _constructorForNewFromRawValues(width, height, rawRgbaValues) {
    this._width = width;
    this._height = height;
    this._pixels = [];

    if (rawRgbaValues.length !== width * height * 4) {
      throw new Error("Invalid RGBA array");
    }

    for (let i = 0; i < rawRgbaValues.length; i += 4) {
      const currentRgbaValue = rawRgbaValues.slice(i, i + 4);
      const pixel = this._encodePixel(currentRgbaValue);
      this._pixels.push(pixel);
    }
  }
}
