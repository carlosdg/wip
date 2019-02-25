import RgbaImageBuffer from "./RgbaImageBuffer";

/**
 * Class to represent an image histogram. Each image has associated histograms
 * which describes the way that its pixels values are distributed.
 *
 * An object of this class wraps the values of the histogram besides some useful
 * information.
 */
export default class Histogram {
  /**
   * Creates an instance of this class.
   *
   * @param {RgbaImageBuffer} imagePixels Image Buffer to create the histogram
   * for
   */
  constructor(imagePixels) {
    this.setImagePixels(imagePixels.pixels);
  }

  /**
   * Sets the pixels values of the associated image and extracts histogram
   * values and useful information.
   */
  setImagePixels(imagePixels) {
    this.histogramValues = new Array(256).fill(0);
    for (let i = 0; i < imagePixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
      if (imagePixels[i + 3] === 0) {
        // The transparent pixels are ignored
        continue;
      }
      this.histogramValues[imagePixels[i]]++;
    }

    this.histogramInfo = {};
    this.histogramInfo.count = this.histogramValues.reduce(
      (previousValue, currentElement) => previousValue + currentElement,
      0
    );

    this.histogramInfo.mean =
      this.histogramValues.reduce(
        (previousValue, currentElement, index) =>
          previousValue + currentElement * index,
        0
      ) / this.histogramInfo.count;

    this.histogramInfo.stdDev = Math.sqrt(
      this.histogramValues.reduce(
        (previousValue, currentElement, index) =>
          previousValue +
          Math.pow(index - this.histogramInfo.mean, 2) * currentElement,
        0
      ) / this.histogramInfo.count
    );

    for (let i = 0; i < this.histogramValues.length; ++i) {
      if (this.histogramValues[i] !== 0) {
        this.histogramInfo.minValue = i;
        break;
      }
    }

    for (let i = this.histogramValues.length - 1; i >= 0; --i) {
      if (this.histogramValues[i] !== 0) {
        this.histogramInfo.maxValue = i;
        break;
      }
    }

    let maxIndex = 0;
    let maxCount = 0;
    this.histogramValues.forEach((count, value) => {
      if (count > maxCount) {
        maxCount = count;
        maxIndex = value;
      }
    });

    this.histogramInfo.mode = {};
    this.histogramInfo.mode.value = maxIndex;
    this.histogramInfo.mode.count = maxCount;

    let entropy = 0;
    let probability;
    for (let i = 0; i < 256; ++i) {
      probability = this.histogramValues[i] / this.histogramInfo.count;
      if (probability > 0) {
        entropy += probability * Math.log2(probability);
      }
    }
    if (entropy !== 0)
      entropy *= -1;

    this.histogramInfo.entropy = entropy.toFixed(3);
  }
}
