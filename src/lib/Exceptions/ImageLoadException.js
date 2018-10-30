/**
 * Class to represent image load errors
 */
export default class ImageLoadException extends Error {
  /**
   * Creates an instance of this class
   *
   * @param {string} errorImageSrc Source of the image that caused the error
   */
  constructor(errorImageSrc) {
    super(`Error loading image with src = ${errorImageSrc}`);
    this.name = "ImageLoadException";
    this.src = errorImageSrc;
  }
}
