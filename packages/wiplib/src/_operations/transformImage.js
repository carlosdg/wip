/**
 * Returns a new ImageBuffer resulting from applying the given lookup table to
 * the given image buffer.
 *
 * @param {ImageBuffer} imgBuffer The image buffer to apply the lookup table to
 * @param {number[][]} lookupTables The expected lookup table has the same shape
 * as the one returned by `createLookupTable`, i.e. for each dimension an array
 * that represents the mapping from one color value to a color value
 * @returns {ImageBuffer} A new ImageBuffer resulting from applying the lookup
 * table to the given image buffer
 */
export function applyLookupTable(imgBuffer, lookupTables) {
  return imgBuffer
    .clone()
    .forEachPixel(pixel =>
      pixel.eachDim((value, dim) => lookupTables[dim][value])
    );
}

/**
 * Creates a lookup table. A lookup table is a data structure that holds a
 * mapping from color value to color value. It is used to perform point
 * operations because it allows to perform the operation for each possible color
 * value instead of doing it for each value in an image. This allows a
 * performance boost because the number of possible color values in a dimension
 * are very few compared to the number of values that an image may have, even
 * for small sized images.
 *
 * The lookup table created with this function is done by iterating, for each
 * dimension, from the minimum value to the maximum value incrementing one by
 * one.
 *
 * @param {number[]} minValues An array with the min possible color value of
 * each dimension
 * @param {number[]} maxValues An array with the max possible color value of
 * each dimension
 * @param {function(number, number, number, number): number} callback A function
 * that is called for each color value between `minValues` and `maxValues` for
 * each dimension (both ends included). It receives the current color value, the
 * minimum and maximum possible values for that color dimension and the index of
 * the current dimension
 * @returns {number[][]} The lookup table: for each dimension an array going
 * from the minimum value of that dimension to the maximum that represents the
 * mapping of the point operation
 */
export function createLookupTable(minValues, maxValues, callback) {
  if (minValues.length !== maxValues.length) {
    throw new Error(
      `Invalid color dimension. Minimum values size "${
        minValues.length
      }" does not match maximum values size "${maxValues.length}"`
    );
  }

  const lookupTables = minValues.map((_, currentDim) => {
    const minValue = minValues[currentDim];
    const maxValue = maxValues[currentDim];
    const currentLookupTable = [];

    for (let value = minValue; value <= maxValue; ++value) {
      currentLookupTable[value] = callback(
        value,
        minValue,
        maxValue,
        currentDim
      );
    }

    return currentLookupTable;
  });

  return lookupTables;
}
