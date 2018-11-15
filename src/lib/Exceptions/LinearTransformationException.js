/**
 * Exception class representing linear transformation errors.
 */
export default class LinearTransformationException extends Error {
  constructor(message) {
    super(message);
    this.name = "LinearTransformationException";
  }
}