/**
 * Class to represent an image cumulative histogram.
 */
export default class CumulativeHistogram {
  /**
   * Creates an instance of this class.
   *
   * @param {Array} histogram Array of values of the histogram to create the
   * cumulative from
   */
  constructor(histogram) {
    let count = 0;

    this.counts = histogram.map(value => {
      count += value;
      return count;
    });
  }
}
