import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { userConstant } from '../constants'
import { NextFunction } from 'express'
import { env } from '../config'

export interface IUser {
  fullname: string
  email: string
  phone?: string
  password: string
  avatar?: string
  role?: string
  status?: string
  isVerified?: boolean
  lastLogin?: Date | null
  deleted?: boolean
  deletedAt?: Date
}

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    password: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: 'example.png'
    },
    role: {
      type: String,
      enum: userConstant.ROLE,
      default: userConstant.ROLE.USER
    },
    status: {
      type: String,
      enum: userConstant.STATUS,
      default: userConstant.STATUS.ACTIVE
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, env.bcrypt.saltRounds)
  next()
})

export default model<IUser>('User', userSchema)
