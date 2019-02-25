import { transformImage } from "./transformImage";
import { ImageOperationException } from "../exceptions";

/**
 * Applies quantization to the given image according to the given
 * amount of levels
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Number} amountOfLevels Amount of bits to represent each value of light
 * @returns {RgbaImageBuffer} Transformed image
 */
export const quantization = (imgBuffer, amountOfLevels) => {
  if (amountOfLevels < 0 || amountOfLevels > 8)
    throw new ImageOperationException(
      "QuantizationException",
      "Invalid amount of levels, the amount should be equal or greater than 0 and equal or less than 8."
    );

  if (!Number.isInteger(amountOfLevels))
    throw new ImageOperationException(
      "QuantizationException",
      "Invalid amount of levels, the value should be an integer number."
    );

  if (amountOfLevels === 8) return imgBuffer;

  let newValues = [0];

  if (amountOfLevels > 1) {
    let part = 256 / (Math.pow(2, amountOfLevels) - 1);
    while (newValues[newValues.length - 1] + part < 255) {
      newValues.push(newValues[newValues.length - 1] + part);
    }
  }

  newValues = newValues.map(value => Math.round(value));

  if (amountOfLevels > 0) {
    newValues.push(255);
  }

  let lookupTable = [];
  let distance;
  let minDistance;
  let index;
  for (let i = 0; i < 256; ++i) {
    minDistance = Number.POSITIVE_INFINITY;
    for (let j = 0; j < newValues.length; ++j) {
      distance = Math.abs(i - newValues[j]);
      if (distance < minDistance) {
        index = j;
        minDistance = distance;
      }
    }
    lookupTable.push(newValues[index]);
  }
  return transformImage(imgBuffer, lookupTable);
};
