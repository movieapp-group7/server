class ApiError extends Error {
  constructor(massage,statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

export {ApiError}