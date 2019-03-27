import Pixel from "./Pixel";

/**
 * ImageBuffer base class. This class define the shape of an ImageBuffer.
 * ImageBuffer classes must implement the following structure to be consistent.
 * Alternatively classes can inherit from this base class and just implement the
 * unimplemented methods.
 */
export default class ImageBuffer {
  /**
   * Creates a instance of this class
   *
   * @param {object} args List of arguments, depending on the arguments provided
   * the new instance will be constructed one way or another:
   * 1. Copy constructor. The expected argument is the ImageBuffer to copy from
   * 2. Constructor for a blank image buffer. The expected arguments are the
   *    width and height of the new image buffer to create and it will be
   *    populated with transparent pixels
   * 3. Constructor from a raw RGBA array of values. The expected arguments are
   *    the width, height and the RGBA array
   * @param {number} args.width This buffer's width
   * @param {number} args.height This buffer's height
   * @param {Uint8ClampedArray} args.data The raw RGBA array
   * @param {ImageBuffer} args.cloneSource The image buffer to create this one
   * from
   * @throws {Error} If the list of arguments is invalid (ex: provided width but
   * no height). Or if there is an error (ex: invalid width and height with
   * respect to the raw RGBA array size)
   */
  constructor({
    width = null,
    height = null,
    data = null,
    cloneSource = null
  } = {}) {
    if (cloneSource !== null) {
      this._constructorForCopy(cloneSource);
    } else if (data !== null && width !== null && height !== null) {
      this._constructorForNewFromRawValues(width, height, data);
    } else if (width !== null && height !== null) {
      this._constructorForBlank(width, height);
    } else {
      throw new Error(`Invalid list of arguments:
      width = ${width}
      height = ${height}
      data = ${data}
      cloneSource = ${cloneSource}`);
    }
  }

  /**
   * Creates a new instance of this image buffer.
   *
   * @see {@link ImageBuffer#constructor}
   */
  new(...args) {
    return new this.constructor(...args);
  }

  /**
   * Returns a copy of this image buffer. Alternative to using
   * `buffer.new(cloneSource: buffer)`
   */
  clone() {
    return this.new({ cloneSource: this });
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
   * Returns the pixel at the given column and row position
   */
  getPixel(i, j) {
    const arrayPos = this._mapMatrixPositionToArray(i, j);
    return this._pixels[arrayPos];
  }

  /**
   * Sets the given pixel to the position specified by the given column and row
   *
   * @returns {ImageBuffer} This image buffer. This is to provide a fluid
   * interface
   */
  setPixel(i, j, pixel) {
    const arrayPos = this._mapMatrixPositionToArray(i, j);
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
    const transparentRawRgbaPixelValue = [0, 0, 0, 0];

    for (let i = 0; i < this._width * this._height; ++i) {
      const pixel = this._encodePixel(transparentRawRgbaPixelValue);
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
