import { Request } from 'express'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { env } from '../config'

const extractToken = (req: Request): string => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) return
  return authHeader.split(' ')[1]
}

const generateAccessToken = (payload: JwtPayload | object | string): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.accessTokenExpiresIn as SignOptions['expiresIn']
  }
  return jwt.sign(payload, env.jwt.accessToken as string, options)
}

const generateRefreshToken = (payload: JwtPayload | object | string): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.refreshTokenExpiresIn as SignOptions['expiresIn']
  }
  return jwt.sign(payload, env.jwt.refreshToken as string, options)
}

const verifyAccessToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, env.jwt.accessToken) as JwtPayload
  return payload
}

const verifyRefreshToken = (token: string): JwtPayload => {
  const payload = jwt.verify(token, env.jwt.refreshToken) as JwtPayload
  return payload
}

export default {
  extractToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
}
