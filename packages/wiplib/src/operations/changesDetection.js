import RgbaImageBuffer from "../RgbaImageBuffer";
import { ImageOperationException } from "../exceptions";
import { imagesDifference } from "./imagesDifference";

/**
 * Detects and highlights the changes of two images
 * according to the given threshold
 *
 * @param {RgbaImageBuffer} firstImgBuffer First image
 * @param {RgbaImageBuffer} secondImgBuffer Second image
 * @param {Number} threshold Threshold for considering a change as a important change
 * @param {Object} changeHighlightColor Color for highlight pixels considered as a change
 * @returns {RgbaImageBuffer} Changes map
 */
export const changesDetection = (
  firstImgBuffer,
  secondImgBuffer,
  threshold,
  changeHighlightColor
) => {
  let difference;
  try {
    difference = imagesDifference(firstImgBuffer, secondImgBuffer);
  } catch (error) {
    if (error.name === "ImagesDifferenceException")
      throw new ImageOperationException(
        "ChangesDetectionException",
        error.message
      );
    else throw error;
  }

  const result = firstImgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    if (difference.pixels[i] > threshold) {
      result.pixels[i] = changeHighlightColor.r;
      result.pixels[i + 1] = changeHighlightColor.g;
      result.pixels[i + 2] = changeHighlightColor.b;
    }
  }

  return result;
};
