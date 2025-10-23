import { Router } from 'express'
import multer from 'multer'

import { cloudinaryMiddleware } from '../../middlewares'
import { uploadController } from '../../controllers/admin'

const uploadRouter = Router()
const upload = multer()

uploadRouter.post('/images', upload.array('images', 5), cloudinaryMiddleware.uploadImages, uploadController.upload)

export default uploadRouter
