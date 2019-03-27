export function imageTranspose(imgBuffer) {
  const newWidth = imgBuffer.height;
  const newHeight = imgBuffer.width;
  const result = imgBuffer.new({ width: newWidth, height: newHeight });

  imgBuffer.forEachPixel((pixel, i, j) => {
    result.setPixel(j, i, pixel);
  });

  return result;
}
