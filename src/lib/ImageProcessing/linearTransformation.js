import RgbaImageBuffer from "../RgbaImageBuffer";
import { LinearTransformationException } from "../Exceptions";

/**
 * Transforms the given image according to the given points
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Array} points Contains the points which defines
 * the sections of the linear transformation
 * @returns {RgbaImageBuffer} Transformed image
 */
export const linearTransformation = (
  imgBuffer,
  points
) => {
  if (points.length < 2)
    throw new LinearTransformationException(
      "Linear transformation needs at least 2 points"
    );
  
  for (let i = 0; i < points.length - 1; ++i) {
    if (points[i].x > points[i + 1].x)
      throw new LinearTransformationException(
        "Points must be ordered according to the x coordinate value"
      );
    
    if (points[i].x === points[i + 1].x)
      throw new LinearTransformationException(
        "Different points should not have the same x coordinate value"
      );
  }
  
  if (points[0].x > 0)
    throw new LinearTransformationException(
      "X coordinate value of the first point should be less or equal to 0"
    );

  if (points[points.length - 1].x < 255)
    throw new LinearTransformationException(
      "X coordinate value of the last point should be greater or equal to 255"
    );

  const result = imgBuffer.copy();

  let sections = [];
  for (let i = 1; i < points.length; ++i) {
    let newSection = {};
    newSection["slope"] = (points[i].y - points[i - 1].y) / (points[i].x - points[i - 1].x);
    newSection["yIntercept"] = points[i].y - newSection.slope * points[i].x;
    newSection["frontier"] = points[i].x;
    sections.push(newSection);
  }

  let lookupTable = [];
  let currentSectionIndex = 0;
  for (let i = 0; i < 256; ++i) {
    if (i > sections[currentSectionIndex].frontier)
      currentSectionIndex++;
    
    let newValue = Math.round(
      sections[currentSectionIndex].slope * i + sections[currentSectionIndex].yIntercept
    );
    lookupTable.push(Math.min(Math.max(newValue, 0), 255));
  }
  
  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let newValue = lookupTable[result.pixels[i]];
    result.pixels[i] = newValue;
    result.pixels[i + 1] = newValue;
    result.pixels[i + 2] = newValue;
  }
  return result;
};