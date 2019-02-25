import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns whether the given value is in range [min, max).
 * That is min <= value < max;
 */
const isInRange = (value, min, max) => value >= min && value < max;

/**
 * Returns the image buffer resulting of rotating the given image buffer.
 * If the rotateAndPaintRotation flag is set to false, the transparent
 * pixels of the resulting image will be filled. The given interpolation
 * method will calculate the values of the new pixels.
 *
 * @param {RgbaImageBuffer} imgBuffer Buffer of the image to rotate
 * @param {Number} degrees Rotation parameter
 * @param {Function} interpolationMethod Interpolation method to calculate the
 * possible new lightness values obtained after applying the geometric operation
 * @param {Boolean} rotateAndPaintRotation Establishes the nature of the rotation
 */
export const imageRotation = (
  imgBuffer,
  degrees,
  interpolationMethod,
  rotateAndPaintRotation
) => {
  const width = imgBuffer.width;
  const height = imgBuffer.height;
  const radians = degrees * (Math.PI / 180);
  const directTransformation = (xCoord, yCoord) => {
    return {
      x: Math.cos(radians) * xCoord - Math.sin(radians) * yCoord,
      y: Math.sin(radians) * xCoord + Math.cos(radians) * yCoord
    };
  };
  const newImageInfo = getRotatedImageInfo(width, height, directTransformation);

  if (rotateAndPaintRotation) {
    return rotateAndPaint(imgBuffer, directTransformation, newImageInfo);
  }

  const inverseTransformation = (xCoord, yCoord) => {
    return {
      x: Math.cos(-radians) * xCoord - Math.sin(-radians) * yCoord,
      y: Math.sin(-radians) * xCoord + Math.cos(-radians) * yCoord
    };
  };

  const resultPixels = new Uint8ClampedArray(
    newImageInfo.width * newImageInfo.height * RgbaImageBuffer.NUM_CHANNELS
  );
  let transformedCoords;
  let newValue;
  let currentIndex = 0;
  for (let j = 0; j < newImageInfo.height; ++j) {
    for (let i = 0; i < newImageInfo.width; ++i) {
      transformedCoords = inverseTransformation(
        i + newImageInfo.minXCoord,
        j + newImageInfo.minYCoord
      );
      if (
        isInRange(Math.round(transformedCoords.x), 0, width + 1) &&
        isInRange(Math.round(transformedCoords.y), 0, height + 1)
      ) {
        newValue = Math.round(
          interpolationMethod(
            transformedCoords.x,
            transformedCoords.y,
            imgBuffer
          )
        );
        // TODO: colored images
        // For now we assume we are operating with grayscale images
        resultPixels[currentIndex] = newValue; // R channel
        resultPixels[currentIndex + 1] = newValue; // G channel
        resultPixels[currentIndex + 2] = newValue; // B channel
        resultPixels[currentIndex + 3] = 255; // A channel
      } else {
        // Background pixel
        resultPixels[currentIndex] = 0; // R channel
        resultPixels[currentIndex + 1] = 0; // G channel
        resultPixels[currentIndex + 2] = 0; // B channel
        resultPixels[currentIndex + 3] = 0; // A channel
      }
      currentIndex += RgbaImageBuffer.NUM_CHANNELS;
    }
  }
  return new RgbaImageBuffer(
    newImageInfo.width,
    newImageInfo.height,
    resultPixels
  );
};

/**
 * Returns the image buffer resulting of rotating the given image buffer.
 * It may contain transparent pixels due to the nature of this rotation
 * process, the inverse tranformation it isn't used.
 *
 * @param {RgbaImageBuffer} imgBuffer Buffer of the image to rotate
 * @param {Function} directTransformation Maps the old image pixels
 * positions to the new one positions
 * @param {Object} newImageInfo Contains relevant information about
 * the resulting image
 */
const rotateAndPaint = (imgBuffer, directTransformation, newImageInfo) => {
  const resultPixels = new Uint8ClampedArray(
    newImageInfo.width * newImageInfo.height * RgbaImageBuffer.NUM_CHANNELS
  );
  let transformedCoords;
  let currentIndex;
  let originalImagePixel;
  for (let j = 0; j < imgBuffer.height; ++j) {
    for (let i = 0; i < imgBuffer.width; ++i) {
      transformedCoords = directTransformation(i, j);
      currentIndex =
        (Math.round(transformedCoords.y - newImageInfo.minYCoord) *
          newImageInfo.width +
          Math.round(transformedCoords.x - newImageInfo.minXCoord)) *
        RgbaImageBuffer.NUM_CHANNELS;
      // TODO: colored images
      // For now we assume we are operating with grayscale images
      originalImagePixel = imgBuffer.getPixel({ x: i, y: j });
      resultPixels[currentIndex] = originalImagePixel[0]; // R channel
      resultPixels[currentIndex + 1] = originalImagePixel[1]; // G channel
      resultPixels[currentIndex + 2] = originalImagePixel[2]; // B channel
      resultPixels[currentIndex + 3] = originalImagePixel[3]; // A channel
    }
  }
  return new RgbaImageBuffer(
    newImageInfo.width,
    newImageInfo.height,
    resultPixels
  );
};

/**
 * Returns information about the rotated image.
 *
 * @param {Number} width Width of the image to rotate
 * @param {Number} height Height of the image to rotate
 * @param {Function} directTransformation Needed to calculate the new dimensions
 */
const getRotatedImageInfo = (width, height, directTransformation) => {
  const upperLeftCornerRotated = directTransformation(0, 0);
  const lowerLeftCornerRotated = directTransformation(0, height);
  const upperRightCornerRotated = directTransformation(width, 0);
  const lowerRightCornerRotated = directTransformation(width, height);
  const maxXCoord = Math.max(
    upperLeftCornerRotated.x,
    lowerLeftCornerRotated.x,
    upperRightCornerRotated.x,
    lowerRightCornerRotated.x
  );
  const minXCoord = Math.min(
    upperLeftCornerRotated.x,
    lowerLeftCornerRotated.x,
    upperRightCornerRotated.x,
    lowerRightCornerRotated.x
  );
  const maxYCoord = Math.max(
    upperLeftCornerRotated.y,
    lowerLeftCornerRotated.y,
    upperRightCornerRotated.y,
    lowerRightCornerRotated.y
  );
  const minYCoord = Math.min(
    upperLeftCornerRotated.y,
    lowerLeftCornerRotated.y,
    upperRightCornerRotated.y,
    lowerRightCornerRotated.y
  );

  return {
    width: Math.floor(Math.abs(maxXCoord - minXCoord)),
    height: Math.floor(Math.abs(maxYCoord - minYCoord)),
    minXCoord: minXCoord,
    minYCoord: minYCoord
  };
};
