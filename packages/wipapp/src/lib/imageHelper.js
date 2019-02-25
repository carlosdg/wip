import { ImageLoadException } from "./Exceptions";

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
    image.onerror = () => reject(new ImageLoadException(src));
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
