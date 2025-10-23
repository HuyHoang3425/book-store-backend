import { Request, Response } from 'express'
import morgan from 'morgan'
import { logger } from '../config'

const stream = {
  write: (msg: string) => {
    const statusCode = parseInt(msg.match(/\[(\d{3})\]/)?.[1] || '200', 10)

    if (statusCode >= 500) {
      logger.error(msg.trim())
    } else if (statusCode >= 400) {
      logger.warn(msg.trim())
    } else {
      logger.info(msg.trim())
    }
  }
}

morgan.token('params', (req: Request) => JSON.stringify(req.params))
morgan.token('body', (req: Request) => JSON.stringify(req.body))

const morganMiddleware = morgan('[:method] [:status] :url :response-time ms [Params: :params] [Body: :body]', {
  stream
})

export default morganMiddleware
