import RgbaImageBuffer from "../RgbaImageBuffer";
import { ImageOperationException } from "../exceptions";

/**
 * Calculates the difference (absolute value) between two images
 *
 * @param {RgbaImageBuffer} firstImgBuffer First image
 * @param {RgbaImageBuffer} secondImgBuffer Second image
 * @returns {RgbaImageBuffer} Result image
 */
export const imagesDifference = (firstImgBuffer, secondImgBuffer) => {
  if (
    firstImgBuffer.height !== secondImgBuffer.height ||
    firstImgBuffer.width !== secondImgBuffer.width
  )
    throw new ImageOperationException(
      "ImagesDifferenceException",
      "Images should have the same width and height"
    );

  const result = firstImgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    result.pixels[i] = Math.abs(result.pixels[i] - secondImgBuffer.pixels[i]);
    result.pixels[i + 1] = Math.abs(result.pixels[i + 1] - secondImgBuffer.pixels[i + 1]);
    result.pixels[i + 2] = Math.abs(result.pixels[i + 2] - secondImgBuffer.pixels[i + 2]);
  }

  return result;
};
