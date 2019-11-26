export function OperationalError(message) {
  this.name = "OperatorError";
  this.message = message;
  this.stack = new Error().stack;
}
