import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi, { ObjectSchema } from 'joi'
import { response } from '../utils'

type ReqKeys = 'body' | 'query' | 'params'

const validate =
  (schema: Partial<Record<ReqKeys, ObjectSchema<any>>>) => (req: Request, res: Response, next: NextFunction) => {
    for (const key of Object.keys(schema) as ReqKeys[]) {
      const value = req[key]
      const { error } = schema[key].validate(value, { abortEarly: false })

      if (error) {
        const messages = error.details.map((detail) => detail.message).join(',')
        return res.status(StatusCodes.BAD_REQUEST).json(response(StatusCodes.BAD_REQUEST, messages))
      }
    }
    next()
  }

export default validate
