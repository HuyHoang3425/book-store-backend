import { Router } from 'express'
import authRouter from './admin/auth.route'
import productRouter from './admin/product.route'
import { authMiddleware } from '../middlewares'

const routers: Router = Router()
//router admin
routers.use('/auth', authRouter)

routers.use('/products', authMiddleware, productRouter)

//end router admin
export default routers
