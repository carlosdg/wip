/**
 * Exception class representing gamma correction errors.
 */
export default class GammaCorrectionException extends Error {
  constructor(message) {
    super(message);
    this.name = "GammaCorrectionException";
  }
}