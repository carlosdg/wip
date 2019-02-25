/**
 * Exception class representing image operations errors.
 */
export default class ImageOperationException extends Error {
  constructor(exceptionName, message) {
    super(message);
    this.name = exceptionName;
  }
}
