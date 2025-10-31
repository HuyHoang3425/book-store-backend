import { Router } from 'express'
import authRouter from './admin/auth.route'
import productRouter from './admin/product.route'
import uploadRouter from './admin/upload.route'
import { authMiddleware } from '../middlewares'
import categoryRouter from './admin/category.route'

const routers: Router = Router()
//router admin
routers.use('/auth', authRouter)

routers.use('/products', authMiddleware, productRouter)

routers.use('/upload', authMiddleware, uploadRouter)

routers.use('/category', authMiddleware, categoryRouter)

//end router admin
export default routers
