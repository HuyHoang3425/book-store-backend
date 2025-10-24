import { Router } from 'express'
import authRouter from './admin/auth.route'
import productRouter from './admin/product.route'
import uploadRouter from './admin/upload.route'
import { authMiddleware } from '../middlewares'
import searchRouter from './admin/search.route'

const routers: Router = Router()
//router admin
routers.use('/auth', authRouter)

routers.use('/products', authMiddleware, productRouter)

routers.use('/upload', authMiddleware, uploadRouter)

routers.use('/search', authMiddleware, searchRouter)

//end router admin
export default routers
