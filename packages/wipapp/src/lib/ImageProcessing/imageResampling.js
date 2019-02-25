import RgbaImageBuffer from "../RgbaImageBuffer";
import {ImageOperationException} from "../Exceptions";

/**
 * Applies resampling operation to the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Number} blockWidth Width of the pixels block to resample the image
 * @param {Number} blockHeight Height of the pixels block to resample the image
 * @returns {RgbaImageBuffer} Transformed image
 */
export const imageResampling = (
  imgBuffer,
  blockWidth,
  blockHeight
) => {

  if (blockWidth < 1 || blockWidth > imgBuffer.width)
    throw new ImageOperationException(
      "ImageResamplingException", 
      "Invalid block width value, block width should be greater than 0 and less or equal than image width."
    );
  
  if (blockHeight < 1 || blockHeight > imgBuffer.height)
    throw new ImageOperationException(
      "ImageResamplingException", 
      "Invalid block height value, block height should be greater than 0 and less or equal than image height."
    );
  
  const resultPixels = new Uint8ClampedArray(
    imgBuffer.width * imgBuffer.height * RgbaImageBuffer.NUM_CHANNELS
  );

  let initialY = 0;
  let initialX;
  while (initialY + blockHeight <= imgBuffer.height) {
    initialX = 0;
    while(initialX + blockWidth <= imgBuffer.width) {
      resampleBlock(imgBuffer, resultPixels, initialX, initialY, initialX + blockWidth, initialY + blockHeight);
      initialX = initialX + blockWidth;
    }
    //Residual X
    resampleBlock(imgBuffer, resultPixels, initialX, initialY, imgBuffer.width, initialY + blockHeight);
    initialY = initialY + blockHeight;
  }
  
  initialX = 0;
  while(initialX + blockWidth <= imgBuffer.width) {
    // Residual Y
    resampleBlock(imgBuffer, resultPixels, initialX, initialY, initialX + blockWidth, imgBuffer.height);
    initialX = initialX + blockWidth;
  }
  // Residual X and Y
  resampleBlock(imgBuffer, resultPixels, initialX, initialY, imgBuffer.width, imgBuffer.height);

  return new RgbaImageBuffer(
    imgBuffer.width, 
    imgBuffer.height, 
    resultPixels
  );
}

/**
 * Resamples the given block of the given image
 * 
 * @param {RgbaImageBuffer} imgBuffer Image which contains the block 
 * @param {Array} pixels Result of resampling the given block
 * @param {Number} initialX X axis position of the upper left corner of the block 
 * @param {Number} initialY Y axis position of the upper left corner of the block
 * @param {Number} xLimit X axis position of the lower right corner of the block
 * @param {Number} yLimit Y axis position of the lower right corner of the block
 */
export const resampleBlock = (
  imgBuffer,
  pixels,
  initialX,
  initialY,
  xLimit,
  yLimit
) => {
  let sum = 0;
  let count = 0;
  let newValue;
  let index;
  // New value calc
  for (let y = initialY; y < yLimit; ++y) {
    for (let x = initialX; x < xLimit; ++x) {
      sum = sum + imgBuffer.getPixel({x, y})[0];  // R channel
      count = count + 1;
    }
  }
  newValue = sum / count;
  // Block resampling
  for (let y = initialY; y < yLimit; ++y) {
    for (let x = initialX; x < xLimit; ++x) {
      index = (y * imgBuffer.width + x) * RgbaImageBuffer.NUM_CHANNELS;
      pixels[index]     = newValue; // R channel
      pixels[index + 1] = newValue; // G channel
      pixels[index + 2] = newValue; // B channel
      pixels[index + 3] = 255;      // A channel
    }
  }
};