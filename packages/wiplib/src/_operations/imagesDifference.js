import { ImageOperationException } from "../exceptions";

export function imagesDifference(minuend, subtrahend) {
  if (
    minuend.height !== subtrahend.height ||
    minuend.width !== subtrahend.width
  ) {
    throw new ImageOperationException(
      "ImagesDifferenceException",
      "Images should have the same width and height"
    );
  }

  return minuend.clone().forEachPixel((pixel, i, j) => {
    const subtrahendPixel = subtrahend.getPixel(i, j);
    pixel.combineEachDim(subtrahendPixel, ([first, second]) =>
      Math.abs(first - second)
    );
  });
}
