class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError(message) {
    return new ApiError(401, message || "401 Unauthorized");
  }

  static BadRequest(status, message, errors = []) {
    return new ApiError(status || 400, message, errors);
  }
}

module.exports = ApiError;
