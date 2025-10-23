import { Router, Request, Response } from 'express'
import { authController } from '../../controllers/admin'
import validate from '../../middlewares/validate.middleware'
import { authValidate } from '../../validates'
import { authMiddleware } from '../../middlewares'

const authRouter: Router = Router()

authRouter.post('/register', validate(authValidate.register), authController.register)

authRouter.post('/login', validate(authValidate.login), authController.login)

authRouter.post('/refresh-token', authController.refreshToken)

authRouter.post('/logout', authController.logout)

export default authRouter
