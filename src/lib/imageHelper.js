/**
 * Class to represent image load errors
 */
export class ImageLoadError extends Error {
  /**
   * Creates an instance of this class
   *
   * @param {string} errorImageSrc Source of the image that caused the error
   * @param {string} message Error message
   */
  constructor(errorImageSrc, message = "Error loading image") {
    super(message);
    this.name = "ImageLoadError";
    this.src = errorImageSrc;
  }
}

/**
 * Returns an promise that resolves with
 * an image when it is loaded from the given source
 *
 * @param {string} src Image source
 * @returns {Promise<Image>} Image element after the content has
 * been loaded
 */
export function load(src) {
  const image = new Image();
  image.src = src;

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new ImageLoadError(src));
  });
}

/**
 * Given a File, Blob object or any other object accepted by
 * `URL.createObjectURL`, returns the image loaded from the
 * object source
 *
 * @param {Object} obj Object to get the image source URL
 */
export function loadFromObject(obj) {
  const src = URL.createObjectURL(obj);
  return load(src).finally(() => URL.revokeObjectURL(src));
}
