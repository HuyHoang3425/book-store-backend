import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

import { env } from '../../config'
import { ApiError, catchAsync, jwt, response } from '../../utils'
import userModel, { IUser } from '../../models/user.model'
import { userInfo } from 'node:os'
import { tokenModel } from '../../models'

type UserRegister = Pick<IUser, 'email' | 'password' | 'fullname'> & {
  repeatPassword: string
  role?: string
}
//[POST] /auth/register
const register = catchAsync(async (req: Request<{}, {}, UserRegister>, res: Response): Promise<void> => {
  const { email, password, repeatPassword, fullname, role } = req.body
  const user = await userModel.findOne({ email }).select('fullname email password role')
  if (user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Email đã tồn tại.')
  }

  if (password !== repeatPassword) {
    throw new ApiError(StatusCodes.CONFLICT, 'Mật khẩu không khớp')
  }
  console.log('Admin', env.register.adminsMail)
  if (role === 'admin' && !env.register.adminsMail.includes(email)) {
    throw new ApiError(StatusCodes.CONFLICT, 'Bạn phải đăng ký dưới quyền là admin.')
  }

  const newUser = await userModel.create({
    fullname,
    email,
    password,
    role
  })

  //tạo token
  const accessToken = jwt.generateAccessToken({ userId: newUser.id })
  const refreshToken = jwt.generateRefreshToken({ userId: newUser.id })

  //lưu token vào db
  await tokenModel.create({
    userId: user.id,
    refreshToken
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.server.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000
  })

  const userResponse = newUser.toObject()
  delete userResponse.password

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Đăng ký thành công.', {
      user: userResponse,
      accessToken
    })
  )
})

//[POST] /auth/login
type UserLogin = Pick<IUser, 'email' | 'password'>
const login = catchAsync(async (req: Request<{}, {}, UserLogin>, res: Response): Promise<void> => {
  const { email, password } = req.body

  const user = await userModel.findOne({ email }).select('fullname email password role')
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không hợp lệ.')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email hoặc mật khẩu không hợp lệ.')
  }

  //tạo token
  const accessToken = jwt.generateAccessToken({ userId: user.id })
  const refreshToken = jwt.generateRefreshToken({ userId: user.id })

  //lưu token vào db
  await tokenModel.create({
    userId: user.id,
    refreshToken
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.server.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 15 * 24 * 60 * 60 * 1000
  })

  const userResponse = user.toObject()
  delete userResponse.password

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Đăng nhập thành công.', {
      user: userResponse,
      accessToken
    })
  )
})

//[POST] /auth/refresh-token
const refreshToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy refresh token.')
  }

  const tokenDoc = await tokenModel.findOne({ refreshToken })
  if (!tokenDoc) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token hết hạn hoặc không tồn tại.')
  }

  const payload = jwt.verifyRefreshToken(refreshToken) as { userId: string }
  if (!payload) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ.')
  }

  if (tokenDoc.userId.toString() !== payload.userId) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Token không khớp với user.')
  }

  const accessToken = jwt.generateAccessToken({ userId: payload.userId })

  res.status(StatusCodes.OK).json(
    response(StatusCodes.OK, 'Refresh token thành công.', {
      accessToken
    })
  )
})

const logout = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Không tìm thấy refresh token.')
  }

  //xoá token ở db
  await tokenModel.deleteOne({ refreshToken })

  //xoá token ở client
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.server.nodeEnv === 'production',
    sameSite: 'strict'
  })

  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'Đăng xuất thành công.'))
})

const me = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const user = req['user']
  res.status(StatusCodes.OK).json(response(StatusCodes.OK, 'thành công.',user))
})

export default {
  register,
  login,
  refreshToken,
  logout,
  me
}
