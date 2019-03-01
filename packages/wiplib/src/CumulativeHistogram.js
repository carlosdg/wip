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
    let count;
    this.counts = {};
    Object.keys(histogram).forEach( key => {
      count = 0;
      this.counts[key] = {};
      this.counts[key] = histogram[key].map(value => {
        count += value;
        return count;
      });
    });
    
    this.count = count;
  }
}
