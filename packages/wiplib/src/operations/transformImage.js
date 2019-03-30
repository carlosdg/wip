import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns a new RgbaImageBuffer resulting from applying the given lookup table
 * to the given image buffer.
 *
 * @param {RgbaImageBuffer} imgBuffer The image buffer to apply the lookup table
 * to
 * @param {number[][]} lookupTables The expected lookup table has the same shape
 * as the one returned by `createLookupTable`, i.e. for each dimension an array
 * that represents the mapping from one color value to a color value
 * @returns {RgbaImageBuffer} A new ImageBuffer resulting from applying the
 * lookup table to the given image buffer
 */
export function applyLookupTable(imgBuffer, lookupTables) {
  const result = imgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    result.pixels[i] = lookupTables[0][result.pixels[i]];
    result.pixels[i + 1] = lookupTables[1][result.pixels[i + 1]];
    result.pixels[i + 2] = lookupTables[2][result.pixels[i + 2]];
  }

  return result;
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
 * @param {function(number): (function(number): number)} dimMapper A function
 * that is called for each color dimension with the current dimension index. It
 * is expected that it returns the function that will be called for each color
 * value of the respective dimension to construct the lookup table.
 * @returns {number[][]} The lookup table: for each dimension an array going
 * from the minimum value of that dimension to the maximum that represents the
 * mapping of the point operation
 */
export function createLookupTable(dimMapper) {
  const lookupTables = [];

  for (let dim = 0; dim < 3; ++dim) {
    const pixelMapper = dimMapper(dim);
    const currentLookupTable = [];

    for (let value = 0; value <= 255; ++value) {
      const mappedValue = pixelMapper(value);
      currentLookupTable.push(mappedValue);
    }

    lookupTables.push(currentLookupTable);
  }

  return lookupTables;
}
