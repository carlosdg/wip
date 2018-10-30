/**
 * Exception class representing out of bounds exceptions. Used to know that some
 * value is not in a range that was supposed to be
 */
export default class ValueOutOfBoundsException extends Error {
  constructor(valueOutOfBounds, boundMinimum, boundMaximum) {
    super(
      `${valueOutOfBounds} must be between ${boundMinimum} and ${boundMaximum}`
    );

    this.name = "ValueOutOfBoundsException";
    this.valueOutOfBounds = valueOutOfBounds;
    this.boundMinimum = boundMinimum;
    this.boundMaximum = boundMaximum;
  }
}
