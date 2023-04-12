import httpStatus from 'http-status'
import { environment } from '../config.js'
import ApiError from '../utils/ApiError.js'

export const errorConverter = (err, req, res, next) => {
  let error = err

  // if the error is of not instanceof ApiError then apply create an ApiError instance and return
  // that as the new error to the error handler
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR

    const message = error.message || httpStatus[statusCode]

    error = new ApiError(statusCode, message, err.stack)
  }

  next(error)
}

export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err

  // if (environment === 'production') {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR

  //   message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
  // }

  res.locals.errorMessage = err.message

  const response = {
    code: statusCode,
    message,
    ...(environment && { info: err.info }),
    ...(environment && { stack: err.stack })
  }

  res.status(statusCode).send(response)
}
