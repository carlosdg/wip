import { createLookupTable, applyLookupTable } from "./transformImage";

export function brightnessAndContrastAdjustment(
  imgBuffer,
  oldBrightnesses,
  oldContrasts,
  newBrightnesses,
  newContrasts
) {
  const adjustDim = (dim, min, max) => {
    const A = newContrasts[dim] / oldContrasts[dim];
    const B = newBrightnesses[dim] - A * oldBrightnesses[dim];
    return value => {
      const newValue = Math.round(A * value + B);
      const clippedValue = Math.min(Math.max(newValue, min), max);
      return clippedValue;
    };
  };
  const minValues = imgBuffer.minPixelValues;
  const maxValues = imgBuffer.maxPixelValues;
  const lookupTable = createLookupTable(minValues, maxValues, adjustDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
