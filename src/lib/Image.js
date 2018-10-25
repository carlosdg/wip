/** Number of channels in a RGBA pixel */
const RGBA_PIXEL_DIMENSIONS = 4;
/** Helper method to get the given value constrained by a min and max value */
const toMinMaxRange = (min, value, max) => Math.max(min, Math.min(value, max));

/**
 * Class to represent a pixel matrix (an image).
 *
 * This class aims to abstract away the pixel
 * related manipulations
 */
export default class Image {
  /**
   * Creates an instance of this class. Note: this treats
   * the given pixels as RGBA pixels
   *
   * @param {number} width Pixel matrix width
   * @param {number} height Pixel matrix height
   * @param {Array} pixels Array of RGBA Pixels
   */
  constructor(width, height, pixels) {
    // TODO: check that everything is right (width, height > 0;
    // width * height * rgbaDimension = pixels.length; etc)
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    this.pixelDimension = RGBA_PIXEL_DIMENSIONS;
  }

  /**
   * Given a coordinate in matrix space (2 dimensions) this
   * method returns the corresponding coordinate in vector
   * space (1 dimension).
   *
   * TODO: check that x & y are in range? or leave it to the caller?
   *
   * @param {number} x Horizontal coordinate
   * @param {number} y Vertical coordinate
   * @returns {number} Corresponding vector coordinate
   */
  mapMatrixPositionToArray = (x, y) =>
    (y * this.width + x) * this.pixelDimension;

  /**
   * Returns the pixel value at the given position
   *
   * TODO: decide whether to leave it as it is or
   * throw when the coordinates are not valie
   *
   * @param {Object} coordinates Matrix coordinates of the pixel to get
   * @param {number} coordinates.x Horizontal coordinate
   * @param {number} coordinates.y Vertical coordinate
   * @returns {Array} Pixel value at the given coordinates (an array
   *  with one element per pixel dimension, 4 in case of RGBA for example)
   */
  getPixel = coordinates => {
    const x = toMinMaxRange(0, coordinates.x, this.width);
    const y = toMinMaxRange(0, coordinates.y, this.height);
    const pixelPosition = this.mapMatrixPositionToArray(x, y);

    return this.pixels.slice(
      pixelPosition,
      pixelPosition + this.pixelDimension
    );
  };

  /**
   * Returns the pixels of the image
   *
   * @returns {Array} Pixels values of the image, an element
   * for each pixel dimension (4 in case of RGBA for example)
   */
  getPixels = () => {
    return this.pixels;
  };

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
  getChannelValues = (channelPosition) => {
    if (!channelPosition instanceof Number || (channelPosition < 0 || channelPosition > 3))
      throw new TypeError('Expected a channel position (between 0 and 3 ())');

    let desiredChannelValues = [];
    for (let i = channelPosition; i < this.pixels.length; i += RGBA_PIXEL_DIMENSIONS) {
      desiredChannelValues.push(this.pixels[i]);
    }

    return desiredChannelValues;
  };

  /**
   * Returns the values of the grayscale pixels of the image.
   * The method works even though the image is not in grayscale.
   */
  getGrayscaleValues = () => {
    if (!Image.isInGrayscale(this.pixels))
      return Image.convertToGrayscale(this.pixels);

    let grayscaleValues = [];
    for (let i = 0; i < this.pixels.length; i += RGBA_PIXEL_DIMENSIONS) {
      grayscaleValues.push(this.pixels[i]);
    }
    return grayscaleValues;
  }

  /**
   * Returns the given pixels converted to grayscale,
   * according to Phase Alternating Line (PAL). We assume
   * that the given pixels are in RGBA.
   *
   * @param {Array} pixels Pixels to convert
   * @returns {Array} Pixels values of the image, an element
   * for each pixel dimension (1 in case of grayscale)
   */
  static convertToGrayscale = (pixels) => {
    if (!pixels instanceof Array)
      throw new TypeError('Expected array of pixels');

    let convertedPixels = [];
    for (let i = 0; i < pixels.length; i += RGBA_PIXEL_DIMENSIONS) {
      let rComponent = pixels[i],
          gComponent = pixels[i + 1],
          bComponent = pixels[i + 2];
      convertedPixels.push(Math.round(rComponent * 0.222 + gComponent * 0.707 + bComponent * 0.071));
    }

    return convertedPixels;
  };

  /**
   * Checks if the given image (array of pixels) is in grayscale.
   *
   * @param {Array} pixels Pixels to check
   * @returns {Boolean} Result of the comprobation
   */
  static isInGrayscale = (pixels) => {
    if (!pixels instanceof Array)
      throw new TypeError('Expected array of pixels');

    for (let i = 0; i < pixels.length; i += RGBA_PIXEL_DIMENSIONS) {
      let rComponent = pixels[i],
          gComponent = pixels[i + 1],
          bComponent = pixels[i + 2];

      if (rComponent !== gComponent || gComponent !== bComponent)
        return false;
    }
    return true;
  };
}
