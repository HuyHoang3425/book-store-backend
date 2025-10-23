import { Router } from 'express'
import authRouter from './auth.route'
import productRouter from './product.route'
import { authMiddleware } from '../middlewares'

const routers: Router = Router()

routers.use('/auth', authRouter)

routers.use('/products',authMiddleware, productRouter)


export default routers
