class ApiError extends Error {
  constructor(statusCode, message, stack = '', info) {
    super(message)

    this.statusCode = statusCode
    this.info = info

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  statusCode
  info
}

export default ApiError
