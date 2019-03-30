import { applyLookupTable, createLookupTable } from "./transformImage";
import { ImageOperationException } from "../exceptions";

export function linearTransformation(imgBuffer, points) {
  console.log({ imgBuffer, points });
  validatePoints(points, imgBuffer);

  const sections = points.map(extractSections);
  const lookupTable = createLookupTable(dim => {
    const currentSections = sections[dim];
    let currentSectionIndex = 0;

    return value => {
      const { frontier, slope, yIntercept } = currentSections[
        currentSectionIndex
      ];

      if (value > frontier) {
        currentSectionIndex += 1;
      }

      const newValue = Math.round(slope * value + yIntercept);
      const newValueClipped = Math.min(Math.max(newValue, 0), 255);
      return newValueClipped;
    };
  });

  return applyLookupTable(imgBuffer, lookupTable);
}

function validatePoints(points) {
  if (points.length !== 3) {
    throw new ImageOperationException(
      "LinearTransformationException",
      "Linear transformation needs 3 sets of points, one for each color dimension"
    );
  }

  points.forEach((points, dim) => {
    if (points.length < 2) {
      throw new ImageOperationException(
        "LinearTransformationException",
        `Linear transformation needs at least 2 points for each dimension. Color dimension number ${dim} has ${
          points.length
        }`
      );
    }

    for (let i = 0; i < points.length - 1; ++i) {
      const current = points[i];
      const next = points[i + 1];

      if (current.x > next.x) {
        throw new ImageOperationException(
          "LinearTransformationException",
          "Points must be ordered according to the x coordinate value"
        );
      }

      if (current.x === next.x) {
        throw new ImageOperationException(
          "LinearTransformationException",
          "Different points should not have the same x coordinate value"
        );
      }
    }

    if (points[0].x > 0) {
      throw new ImageOperationException(
        "LinearTransformationException",
        `X coordinate value of the first point should be less or equal to 0 for the color dimension number ${dim}`
      );
    }

    if (points[points.length - 1].x < 255) {
      throw new ImageOperationException(
        "LinearTransformationException",
        `X coordinate value of the last point should be greater or equal to 255 for the color dimension number ${dim}`
      );
    }
  });
}

function extractSections(points) {
  const sections = [];

  for (let i = 1; i < points.length; ++i) {
    const current = points[i];
    const prev = points[i - 1];

    const slope = (current.y - prev.y) / (current.x - prev.x);
    const yIntercept = current.y - slope * current.x;
    const frontier = current.x;

    sections.push({
      slope,
      yIntercept,
      frontier
    });
  }

  return sections;
}
