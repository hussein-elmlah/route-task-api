class CustomError extends Error {
  constructor(message, status = 500, context = {}) {
    super(message);
    this.status = status;
    this.context = context;
  }
}

module.exports = CustomError;
