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
    // Boolean to check if the image is in grayscale
    let grayscaleImage = true;
    this.histogramValues = {
      "Red": new Array(256).fill(0),
      "Green": new Array(256).fill(0),
      "Blue": new Array(256).fill(0),
      "Gray": new Array(256).fill(0)
    };

    // Histogram values update
    for (let i = 0; i < imagePixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
      if (imagePixels[i + 3] === 0) {
        // The transparent pixels are ignored
        continue;
      }


      this.histogramValues["Red"][imagePixels[i]]++;
      this.histogramValues["Green"][imagePixels[i + 1]]++;
      this.histogramValues["Blue"][imagePixels[i + 2]]++;
      this.histogramValues["Gray"][Math.round(
        imagePixels[i] * 0.222 + 
        imagePixels[i + 1] * 0.707 + 
        imagePixels[i + 2] * 0.071
      )]++;

      // Grayscale image comprobation
      if (
        grayscaleImage && 
        (imagePixels[i] !== imagePixels[i + 1] || imagePixels[i] !== imagePixels[i + 2])
      ) {
        grayscaleImage = false;
      }
    }

    let count = this.histogramValues["Red"].reduce(
      (previousValue, currentElement) => previousValue + currentElement,
      0
    );

    // If the image is in grayscale histogramValues object is updated
    if (grayscaleImage) {
      delete this.histogramValues["Red"];
      delete this.histogramValues["Blue"];
      delete this.histogramValues["Green"];
    }

    // Object which contains histogram and image information
    this.histogramInfo = {};

    // Image brightness
    this.histogramInfo.brightness = this.histogramValues["Gray"].reduce(
      (previousValue, currentElement, index) =>
        previousValue + currentElement * index,
      0
    ) / count;

    this.histogramInfo.contrast = Math.sqrt(
      this.histogramValues["Gray"].reduce(
        (previousValue, currentElement, index) =>
          previousValue +
          Math.pow(index - this.histogramInfo.brightness, 2) * currentElement,
        0
      ) / count
    );

    // Information for each channel
    Object.keys(this.histogramValues).forEach( key => {

      this.histogramInfo[key] = {};
      
      this.histogramInfo[key].count = count;

      /*
      // Mean
      this.histogramInfo[key].mean =
        this.histogramValues[key].reduce(
          (previousValue, currentElement, index) =>
            previousValue + currentElement * index,
          0
        ) / this.histogramInfo[key].count;
      
      // Standard deviation
      this.histogramInfo[key].stdDev = Math.sqrt(
        this.histogramValues[key].reduce(
          (previousValue, currentElement, index) =>
            previousValue +
            Math.pow(index - this.histogramInfo[key].mean, 2) * currentElement,
          0
        ) / this.histogramInfo[key].count
      );
      */
          
      // Minimum value
      for (let i = 0; i < this.histogramValues[key].length; ++i) {
        if (this.histogramValues[key][i] !== 0) {
          this.histogramInfo[key].minValue = i;
          break;
        }
      }
      
      // Maximum value
      for (let i = this.histogramValues[key].length - 1; i >= 0; --i) {
        if (this.histogramValues[key][i] !== 0) {
          this.histogramInfo[key].maxValue = i;
          break;
        }
      }
      
      // Mode
      let maxIndex = 0;
      let maxCount = 0;
      this.histogramValues[key].forEach((count, value) => {
        if (count > maxCount) {
          maxCount = count;
          maxIndex = value;
        }
      });
  
      this.histogramInfo[key].mode = {};
      this.histogramInfo[key].mode.value = maxIndex;
      this.histogramInfo[key].mode.count = maxCount;
      
      // Entropy
      let entropy = 0;
      let probability;
      for (let i = 0; i < 256; ++i) {
        probability = this.histogramValues[key][i] / this.histogramInfo[key].count;
        if (probability > 0) {
          entropy += probability * Math.log2(probability);
        }
      }
      if (entropy !== 0)
        entropy *= -1;
      this.histogramInfo[key].entropy = entropy.toFixed(3);
    });
  }
}
