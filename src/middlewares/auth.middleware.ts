import { NextFunction, Request, Response } from 'express'
import { ApiError, catchAsync, jwt } from '../utils'
import { userModel } from '../models'
import { StatusCodes } from 'http-status-codes'
import { JwtPayload } from 'jsonwebtoken'

const authMiddleware = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = jwt.extractToken(req)
  let payload: JwtPayload
  try {
    payload = jwt.verifyAccessToken(token)
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Access token đã hết hạn')
    }
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ')
  }
  const user = await userModel.findOne({ _id: payload.userId }).select('-password')

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng.')
  }
  req['user'] = user
  next()
})

export default authMiddleware
