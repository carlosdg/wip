import { createLookupTable, applyLookupTable } from "./transformImage";

/**
 * Changes the contrast and the brightness of the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {number[]} oldBrightnesses Previous brightnesses of the image
 * @param {number[]} oldContrasts Previous contrasts of the image
 * @param {number[]} newBrightnesses New brightnesses of the image
 * @param {number[]} newContrasts New contrasts of the image
 * @returns {RgbaImageBuffer} Transformed image
 */
export function brightnessAndContrastAdjustment(
  imgBuffer,
  oldBrightnesses,
  oldContrasts,
  newBrightnesses,
  newContrasts
) {
  const lookupTable = createLookupTable(dim => {
    const slope = newContrasts[dim] / oldContrasts[dim];
    const yIntercept = newBrightnesses[dim] - slope * oldBrightnesses[dim];

    return value => {
      const newValue = Math.round(slope * value + yIntercept);
      const clippedValue = Math.min(Math.max(newValue, 0), 255);
      return clippedValue;
    };
  });

  return applyLookupTable(imgBuffer, lookupTable);
}
