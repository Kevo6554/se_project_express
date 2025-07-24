class NotFoundError extends Error {
  costructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
module.exports = NotFoundError;
