import RgbaImageBuffer from "../RgbaImageBuffer";
import { ImageOperationException } from "../exceptions";

/**
 * Returns the image buffer resulting of resizing the given image buffer.
 *
 * @param {RgbaImageBuffer} imgBuffer Buffer of the image to resize
 * @param {Number} widthPercentage Resizing parameter
 * @param {Number} heightPercentage Resizing parameter
 * @param {Function} interpolationMethod Interpolation method to calculate the
 * possible new lightness values obtained after applying the geometric operation
 */
export const imageResizing = (
  imgBuffer,
  widthPercentage,
  heighPercentage,
  interpolationMethod
) => {
  const oldWidth = imgBuffer.width;
  const oldHeight = imgBuffer.height;
  const widthFactor = widthPercentage / 100;
  const heightFactor = heighPercentage / 100;
  const newWidth = Math.floor(oldWidth * widthFactor);
  const newHeight = Math.floor(oldHeight * heightFactor);

  if (newWidth < 1) {
    throw new ImageOperationException(
      "ImageResizingException",
      "Width of the resized image is too small."
    );
  }
  if (newHeight < 1) {
    throw new ImageOperationException(
      "ImageResizingException",
      "Height of the resized image is too small."
    );
  }

  const inverseTransformation = (xCoord, yCoord) => {
    return {
      x: xCoord / widthFactor,
      y: yCoord / heightFactor
    };
  };

  const resultPixels = new Uint8ClampedArray(
    newWidth * newHeight * RgbaImageBuffer.NUM_CHANNELS
  );
  let transformedCoords;
  let newValue;
  let currentIndex = 0;
  for (let j = 0; j < newHeight; ++j) {
    for (let i = 0; i < newWidth; ++i) {
      transformedCoords = inverseTransformation(i, j);
      newValue = Math.round(
        interpolationMethod(transformedCoords.x, transformedCoords.y, imgBuffer)
      );
      resultPixels[currentIndex] = newValue;
      resultPixels[currentIndex + 1] = newValue;
      resultPixels[currentIndex + 2] = newValue;
      resultPixels[currentIndex + 3] = 255;
      currentIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }
  return new RgbaImageBuffer(newWidth, newHeight, resultPixels);
};
