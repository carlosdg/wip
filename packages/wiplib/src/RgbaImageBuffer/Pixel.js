/**
 * Class representing any pixel.
 *
 * Pixel object are intended to provide image operations an abstraction so they
 * don't have to distinguish between different color spaces, they just apply the
 * operation to each dimension of the pixel `value`.
 *
 * Pixel objects by themselves aren't tied to any color space, they were made
 * to be as general as possible and it is responsibility of ImageBuffers to give
 * pixels a certain meaning in terms of color space.
 */
export default class Pixel {
  /**
   * Creates a pixel object
   *
   * @param {number[]} values Values that image operations will use to apply the
   * operations
   * @param {number} transparency Transparency value in range [0, 1]
   * @param {any} maybeExtraInfo Any extra information to keep in the pixel.
   * This may only be used by ImageBuffers to keep track of information needed
   * to convert the `values` to a color space pixel. For example, if we want to
   * have an ImageBuffer that only uses the red dimension from RGB to process
   * the images, we need to keep the values of green and blue in memory to later
   * convert back the pixel with the processed R to RGB
   */
  constructor(values, transparency, maybeExtraInfo = null) {
    this.setValues(values)
      .setTransparency(transparency)
      ._setExtraInfo(maybeExtraInfo);
  }

  /**
   * Returns the array of values to use in image processing operations
   *
   * @returns {number[]} The values
   */
  get values() {
    return this._values;
  }

  /**
   * Returns the transparency value
   *
   * @returns {number} The transparency
   */
  get transparency() {
    return this._transparency;
  }

  /**
   * Returns the extra information (or null) that this pixel is keeping track of
   *
   * @returns {any} The extra info or null
   */
  get maybeExtraInfo() {
    return this._maybeExtraInfo;
  }

  /**
   * Updates the values of this pixel
   *
   * @param {number[]} newValues New values for this pixel
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  setValues(newValues) {
    this._values = newValues;
    return this;
  }

  /**
   * Updates the transparency of this pixel
   *
   * @param {number} newTransparency New transparency for this pixel
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  setTransparency(newTransparency) {
    this._transparency = newTransparency;
    return this;
  }

  /**
   * @private
   *
   * Updates the extra info of this pixel
   *
   * @param {any} maybeExtraInfo New extra info or null
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  _setExtraInfo(maybeExtraInfo) {
    this._maybeExtraInfo = maybeExtraInfo;
    return this;
  }

  /**
   * Runs the callback for each value, the returned number is set as the new
   * value
   *
   * @param {function(number):number} callback Function called for each value of
   * `values`. It is given each value and the returned result is then set as the
   * new value for that dimension.
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  eachDim(callback) {
    const newValues = this.values.map(callback);
    return this.setValues(newValues);
  }

  /**
   * Runs the callback with the values array and the returned array is set as
   * the new values.
   *
   * @param {function(number[]):number[]} callback Function called with
   * `values`. It is given the `values` and the returned result is then set as
   * the new values.
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  allDims(callback) {
    const newValues = callback(this.values);
    return this.setValues(newValues);
  }

  /**
   * Runs the given function for each pair of values. The function is expected
   * to return a value with will be this pixel's new value for that dimension
   *
   * @param {function(number[]):number} callback Function called for each pair
   * of values
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  combineEachDim(otherPixel, callback) {
    const combinedValues = this.values.map((value, i) => [
      value,
      otherPixel.editableValues[i]
    ]);
    const newValues = combinedValues.map(callback);
    return this.setValues(newValues);
  }

  /**
   * Runs the given function with all pair of values. The function is expected
   * to return an array of numbers which will be this pixel's new `values`
   *
   * @param {function(number[]):number} callback Function called with all pair
   * of values
   * @returns {Pixel} This pixel. This is to provide a fluid interface
   */
  combineAllDims(otherPixel, callback) {
    const combinedValues = this.values.map((value, i) => [
      value,
      otherPixel.editableValues[i]
    ]);
    const newValues = callback(combinedValues);
    return this.setValues(newValues);
  }
}
