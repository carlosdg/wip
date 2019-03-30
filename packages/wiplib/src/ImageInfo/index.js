import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Class to contain image information like the image histogram, number of
 * pixels, minimum and maximum color value, mode, entropy, brightness, contrast,
 * etc.
 */
export default class ImageInfo {
  /**
   * Creates an instance of this class.
   *
   * @param {RgbaImageBuffer} imagePixels Image Buffer to create the histogram
   * for
   */
  constructor(imageBuffer) {
    this.setPixelCount(imageBuffer);
    this.setHistograms(imageBuffer);
    this.setCumulativeHistograms(this.histograms);
    this.setLimits(this.histograms);
    this.setModes(this.histograms);
    this.setEntropies(this.histograms, this.pixelCount);
    this.setBrightnesses(this.histograms, this.pixelCount);
    this.setContrasts(this.histograms, this.brightnesses, this.pixelCount);
  }

  /**
   * Calculates and sets the `pixelCount` property from the given ImageBuffer
   * object
   *
   * @param {RgbaImageBuffer} imageBuffer The image buffer representing the
   * image
   * @param {number} imageBuffer.width  The width of the image
   * @param {number} imageBuffer.height The height of the image
   */
  setPixelCount({ width, height }) {
    this.pixelCount = width * height;
  }

  /**
   * Calculates and sets the `histograms` property from the given ImageBuffer
   * object
   *
   * A histogram is an array that maps each possible color value to the number
   * of its occurrences in the given image
   *
   * @param {RgbaImageBuffer} imageBuffer The image buffer representing the
   * image
   */
  setHistograms({ pixels }) {
    this.histograms = [];
    this.histograms.push(Array(256).fill(0));
    this.histograms.push(Array(256).fill(0));
    this.histograms.push(Array(256).fill(0));

    for (let i = 0; i < pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
      this.histograms[0][pixels[i]] += 1;
      this.histograms[1][pixels[i + 1]] += 1;
      this.histograms[2][pixels[i + 2]] += 1;
    }
  }

  /**
   * Calculates and sets the `cumulativeHistograms` property from the given
   * ImageBuffer object
   *
   * A cumulative histogram is an array that maps each possible color value to
   * the number of its occurrences + the number of occurrences of lower values
   * in the given image
   *
   * @param {RgbaImageBuffer} imageBuffer The image buffer representing the
   * image
   */
  setCumulativeHistograms(histograms) {
    this.cumulativeHistograms = histograms.map(histogram => {
      let accumulatedCount = 0;

      const cumulativeHistogram = histogram.map(count => {
        accumulatedCount += count;
        return accumulatedCount;
      });

      return cumulativeHistogram;
    });
  }

  /**
   * Calculates and sets the `brightnesses` property from the given histograms.
   *
   * The brightness is calculated as the mean of the color values and it
   * represents the overall lightness of the image
   *
   * @param {number[][]} histograms An array of histograms, one for each
   * dimension. Each histogram being the number of occurrences of the i-th pixel
   * in the image
   * @param {number[]} brightnesses An array of brightnesses, one for each
   * dimension. Being each brightness the mean of pixel color values
   * @param {number} pixelCount Number of pixels in the image
   */
  setBrightnesses(histograms, pixelCount) {
    const sumReducer = (sum, count, pixelValue) => sum + count * pixelValue;

    this.brightnesses = histograms.map(histogram => {
      const sum = histogram.reduce(sumReducer, 0);
      const mean = sum / pixelCount;

      return mean;
    });
  }

  /**
   * Calculates and sets the `contrasts` property from the given histograms.
   *
   * The contrast is calculated as the standard deviation of the color values.
   * When the contrast is the minimum (zero), all color values will be the same
   * as the brightness (the mean of color values). So the image colors will be
   * less distinguishable from each other with lower contrast values.
   *
   * When the contrast is maximum, all color values will be as far as possible
   * from the mean and so the image will have most its values at the extremes,
   * having an image whose colors are very easy to distinguish from each other.
   *
   * @param {number[][]} histograms An array of histograms, one for each
   * dimension. Each histogram being the number of occurrences of the i-th pixel
   * in the image
   * @param {number[]} brightnesses An array of brightnesses, one for each
   * dimension. Being each brightness the mean of pixel color values
   * @param {number} pixelCount Number of pixels in the image
   */
  setContrasts(histograms, brightnesses, pixelCount) {
    this.contrasts = histograms.map((histogram, dim) => {
      const sumSquaredErrorReducer = (sum, count, pixelValue) =>
        sum + count * (pixelValue - brightnesses[dim]) ** 2;

      const sum = histogram.reduce(sumSquaredErrorReducer, 0);
      const mean = sum / pixelCount;
      const stdDev = Math.sqrt(mean);

      return stdDev;
    });
  }

  /**
   * Calculates and sets the `smallestNonZeroes` and `largestNonZeroes`
   * properties from the given histograms.
   *
   * The smallest non-zero is the first color value that appears at least once
   * in the image (i.e. its number of occurrences in the histogram is non-zero).
   * While the largest non-zero is the last color value that appears at least
   * once in the image.
   *
   * @param {number[][]} histograms An array of histograms, one for each
   * dimension. Each histogram being the number of occurrences of the i-th pixel
   * in the image
   */
  setLimits(histograms) {
    this.smallestNonZeroes = histograms.map(histogram =>
      histogram.findIndex(pixelCount => pixelCount > 0)
    );

    this.largestNonZeroes = this.histograms.map((histogram, dim) => {
      let pixelValue = this.smallestNonZeroes[dim];

      while (pixelValue < histogram.length && histogram[pixelValue] > 0) {
        pixelValue += 1;
      }

      return pixelValue - 1;
    });
  }

  /**
   * Calculates and sets the `modeIndexes` and `modeValues` properties from the
   * given histograms.
   *
   * The mode index is the color value that is most repeated. While the mode
   * value is the number of occurrences that the most repeated color value has
   *
   * @param {number[][]} histograms An array of histograms, one for each
   * dimension. Each histogram being the number of occurrences of the i-th pixel
   * in the image
   */
  setModes(histograms) {
    const modeIndexReducer = (maxIndex, currPixelCount, currIndex, histogram) =>
      currPixelCount > histogram[maxIndex] ? currIndex : maxIndex;

    this.modeIndexes = histograms.map(histogram => {
      const modeIndex = histogram.reduce(modeIndexReducer, 0);

      return modeIndex;
    });

    this.modeValues = histograms.map(
      (histogram, dim) => histogram[this.modeIndexes[dim]]
    );
  }

  /**
   * Calculates and sets the `entropies` property from the given histograms.
   *
   * The Shannon's entropy can serve as a measure of disorder of information
   * i.e. the higher the entropy the less homogeneous the image (i.e. less
   * different color values)
   *
   * @param {number[][]} histograms An array of histograms, one for each
   * dimension. Each histogram being the number of occurrences of the i-th pixel
   * in the image
   * @param {number} pixelCount Number of pixels in the image
   */
  setEntropies(histograms, pixelCount) {
    const entropyReducer = (totalEntropy, currPixelCount) => {
      const probability = currPixelCount / pixelCount;

      if (probability > 0) {
        return totalEntropy - probability * Math.log2(probability);
      } else {
        return totalEntropy;
      }
    };

    this.entropies = histograms.map(histogram =>
      histogram.reduce(entropyReducer, 0)
    );
  }
}
