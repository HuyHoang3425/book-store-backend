import winston from 'winston'
import { env } from '../config'

const isDev: boolean = env.server.nodeEnv === 'development'

const formats = isDev
  ? [
      winston.format.colorize({ all: true }),
      winston.format.errors({ stack: true }),
      winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, stack }) => `[${timestamp}] [${level}]: ${message || stack}`)
    ]
  : [winston.format.errors({ stack: true }), winston.format.timestamp(), winston.format.json()]

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: winston.format.combine(...formats),
  transports: [
    ...(isDev ? [new winston.transports.Console()] : [])
    // prod có thể thêm File transport
  ],
  exitOnError: false
})

export default logger
