import express, { Express, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { morganMiddleware, env, connectDB, logger } from './config'
import { errorMiddleware } from './middlewares'
import routers from './routes'

const app: Express = express()
const port: number = Number(process.env.PORT) || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)

app.use(cookieParser())

if (env.server.nodeEnv === 'development') {
  app.use(morganMiddleware)
}

app.get('/', (req: Request, res: Response) => {
  res.send('server is running!')
})
app.use('/api/v1', routers)

app.use(errorMiddleware.errorConverter)
app.use(errorMiddleware.errorHandler)

connectDB()
  .then(() => {
    app.listen(env.server.port, () => {
      logger.info(`Server listen on port ${env.server.port}`)
    })
  })
  .catch((error) => {
    {
      logger.error(`Database connection failed:`, error)
      process.exit(1)
    }
  })
