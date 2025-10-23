import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils'
import mongoose from 'mongoose'
import { env, logger } from '../config'
const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode: number = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
        ? StatusCodes.BAD_REQUEST
        : StatusCodes.INTERNAL_SERVER_ERROR
    const message: string = error.message || (StatusCodes[statusCode] as string)
    error = new ApiError(statusCode, message, false, err.stack)
  }
  next(error)
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode: number = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message: string = err.message || 'Unexpected error'

  if (env.server.nodeEnv === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    message = 'Server xảy ra lỗi, vui lòng thử lại sau.'
  }

  res.locals.errorMessage = err.message

  const response = {
    statusCode,
    message,
    ...(env.server.nodeEnv === 'development' && { stack: err.stack }) // chỉ log stack ở dev
  }

  if (env.server.nodeEnv === 'development') {
    logger.error(err)
  } else {
    logger.error(message)
  }

  res.status(statusCode).send(response)
}

export default {
  errorConverter,
  errorHandler
}
