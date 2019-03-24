export function imageTranspose(imgBuffer, imgBufferFactory) {
  const newWidth = imgBuffer.height;
  const newHeight = imgBuffer.width;
  const result = imgBufferFactory(newWidth, newHeight);

  imgBuffer.forEachPixel((pixel, i, j) => {
    result.setPixel(j, i, pixel);
  });

  return result;
}
