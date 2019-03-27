import { ImageOperationException } from "../exceptions";

export function imageResizing(
  imgBuffer,
  widthFactor,
  heightFactor,
  interpolationMethod
) {
  const oldWidth = imgBuffer.width;
  const oldHeight = imgBuffer.height;
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

  const inverseTransformation = (xCoord, yCoord) => ({
    x: xCoord / widthFactor,
    y: yCoord / heightFactor
  });

  return imgBuffer
    .new({ width: newWidth, height: newHeight })
    .forEachPixel((pixel, j, i) => {
      const { x, y } = inverseTransformation(i, j);
      const newValues = interpolationMethod(x, y, imgBuffer).map(Math.round);
      pixel.setValues(newValues);
    });
}
