import * as Checks from "./Checks";
import { ValueOutOfBoundsException } from "./Exceptions";

// TODO: pollyfill ImageData constructor
/**
 * Class to represent a RGBA pixel matrix (an image). This class aims to
 * abstract away the pixel related manipulations by providing a set of
 * convenience methods for iterating through pixels.
 */
export default class RgbaImage {
  /** Number of channels in a RGBA pixel */
  static NUM_CHANNELS = 4;

  /**
   * Convenient function to create a RgbaImage instance from an ImageData object
   * where the width, height are copied but the pixel array is only copied the
   * references
   *
   * @param {ImageData} imgData ImageData instance to create the RgbaImage from
   * @returns {RgbaImage} Instance of RgbaImage initialized from the ImgData
   */
  static fromImageData({ width, height, data }) {
    return new RgbaImage(width, height, data);
  }

  /**
   * Convenient function to create an ImageData object from a RgbaImage object
   *
   * @param {RgbaImage} rgbaImage Instance of RgbaImage used to create the
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
  toImageData = () => RgbaImage.toImageData(this);

  /** Returns a deep copy of this RgbaImage instance */
  copy = () =>
    new RgbaImage(this.width, this.height, new Uint8ClampedArray(this.pixels));

  /**
   * Returns the pixel value at the given position
   *
   * @param {Object} coordinates Matrix coordinates of the pixel to get
   * @param {number} coordinates.x Horizontal coordinate
   * @param {number} coordinates.y Vertical coordinate
   * @returns {Array} Pixel value at the given coordinates (an array with one
   *  element per pixel dimension, 4 in case of RGBA for example)
   * @throws {OutOfBoundsException} If the given coordinates are out of bounds
   */
  getPixel = ({ x, y }) => {
    if (!Checks.isInRange(x, 0, this.width)) {
      throw new ValueOutOfBoundsException(x, 0, this.width);
    }
    if (!Checks.isInRange(y, 0, this.height)) {
      throw new ValueOutOfBoundsException(y, 0, this.height);
    }

    const pixelPosition = this._mapMatrixPositionToArray(x, y);

    return this.pixels.slice(
      pixelPosition,
      pixelPosition + RgbaImage.NUM_CHANNELS
    );
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
    (y * this.width + x) * RgbaImage.NUM_CHANNELS;

  /**
   * Returns a specific channel values of the image.
   * 0 => R channel position
   * 1 => G channel position
   * 2 => B channel position
   * 3 => Alpha channel position
   *
   * @param {Integer} channelPosition Position of the desired
   * channel values in a RGBA pixel.
   * @returns {Array} Desired channel pixels values.
   */
  getChannelValues = channelPosition => {
    if (
      !channelPosition instanceof Number ||
      (channelPosition < 0 || channelPosition > 3)
    )
      throw new TypeError("Expected a channel position (between 0 and 3 ())");

    let desiredChannelValues = [];
    for (
      let i = channelPosition;
      i < this.pixels.length;
      i += RgbaImage.NUM_CHANNELS
    ) {
      desiredChannelValues.push(this.pixels[i]);
    }

    return desiredChannelValues;
  };

  /**
   * Returns the values of the grayscale pixels of the image.
   * The method works even though the image is not in grayscale.
   */
  getGrayscaleValues = () => {
    if (!RgbaImage.isInGrayscale(this.pixels))
      return RgbaImage.convertToGrayscale(this.pixels);

    let grayscaleValues = [];
    for (let i = 0; i < this.pixels.length; i += RgbaImage.NUM_CHANNELS) {
      grayscaleValues.push(this.pixels[i]);
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
  static convertToGrayscale = pixels => {
    if (!pixels instanceof Array)
      throw new TypeError("Expected array of pixels");

    let convertedPixels = [];
    for (let i = 0; i < pixels.length; i += RgbaImage.NUM_CHANNELS) {
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
  static isInGrayscale = pixels => {
    if (!pixels instanceof Array)
      throw new TypeError("Expected array of pixels");

    for (let i = 0; i < pixels.length; i += RgbaImage.NUM_CHANNELS) {
      let rComponent = pixels[i],
        gComponent = pixels[i + 1],
        bComponent = pixels[i + 2];

      if (rComponent !== gComponent || gComponent !== bComponent) return false;
    }
    return true;
  };
}
